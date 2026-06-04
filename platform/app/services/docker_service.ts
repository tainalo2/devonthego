import Docker from 'dockerode'
import dockerConfig from '#config/docker'
import { debianSearchImage } from '#config/modules'

export type ExecResult = {
  stdout: string
  stderr: string
  exitCode: number
}

export type DebianPackageHit = {
  name: string
  description: string
}

export default class DockerService {
  #client: Docker

  constructor() {
    this.#client = new Docker({ socketPath: dockerConfig.socketPath })
  }

  get client() {
    return this.#client
  }

  async ping(): Promise<boolean> {
    try {
      await this.#client.ping()
      return true
    } catch {
      return false
    }
  }

  async getContainer(containerId: string) {
    return this.#client.getContainer(containerId)
  }

  async inspectContainer(containerId: string) {
    const container = this.#client.getContainer(containerId)
    return container.inspect()
  }

  async listDevContainers() {
    const containers = await this.#client.listContainers({ all: true })
    return containers.filter((c) => c.Labels?.['devonthego.managed'] === 'true')
  }

  async removeContainer(containerId: string, force = true) {
    const container = this.#client.getContainer(containerId)
    try {
      await container.stop({ t: 5 })
    } catch {
      // déjà arrêté
    }
    await container.remove({ force })
  }

  async getContainerLogs(containerId: string, tail = 100): Promise<string> {
    const container = this.#client.getContainer(containerId)
    const stream = await container.logs({
      stdout: true,
      stderr: true,
      tail,
      timestamps: true,
    })

    if (Buffer.isBuffer(stream)) {
      return stream.toString('utf8')
    }

    const readable = stream as NodeJS.ReadableStream
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      readable.on('data', (chunk: Buffer) => chunks.push(chunk))
      readable.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
      readable.on('error', reject)
    })
  }

  async exec(
    containerId: string,
    cmd: string[],
    user = 'root',
    timeoutMs = 300_000
  ): Promise<ExecResult> {
    const container = this.#client.getContainer(containerId)
    const execInstance = await container.exec({
      Cmd: cmd,
      AttachStdout: true,
      AttachStderr: true,
      User: user,
    })

    const stream = await execInstance.start({ hijack: true, stdin: false })
    const output = await this.#readDockerStream(stream, timeoutMs)
    const inspect = await execInstance.inspect()

    return {
      stdout: output.stdout,
      stderr: output.stderr,
      exitCode: inspect.ExitCode ?? -1,
    }
  }

  async searchDebianPackages(query: string, limit = 20): Promise<DebianPackageHit[]> {
    const safeQuery = query.trim().toLowerCase().replace(/[^a-z0-9.+_-]/g, '')
    if (safeQuery.length < 2) {
      return []
    }

    const script = [
      'set -e',
      'export DEBIAN_FRONTEND=noninteractive',
      'apt-get update -qq >/dev/null 2>&1',
      `apt-cache search --names-only '${safeQuery}' | head -n ${limit}`,
    ].join('\n')

    try {
      const result = await this.runEphemeralContainer(debianSearchImage, ['bash', '-c', script])
      if (result.exitCode !== 0) {
        return []
      }

      return this.#parseAptCacheSearch(result.stdout)
    } catch {
      return []
    }
  }

  async runEphemeralContainer(image: string, cmd: string[], user = 'root'): Promise<ExecResult> {
    const container = await this.#client.createContainer({
      Image: image,
      Cmd: cmd,
      User: user,
      HostConfig: {
        AutoRemove: false,
        NetworkMode: 'bridge',
      },
    })

    await container.start()
    const waitResult = await container.wait()
    const logs = await container.logs({ stdout: true, stderr: true })
    await container.remove({ force: true })

    const output = Buffer.isBuffer(logs) ? logs.toString('utf8') : ''

    return {
      stdout: output,
      stderr: '',
      exitCode: waitResult.StatusCode ?? -1,
    }
  }

  #parseAptCacheSearch(output: string): DebianPackageHit[] {
    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const separator = line.indexOf(' - ')
        if (separator === -1) {
          return { name: line, description: '' }
        }

        return {
          name: line.slice(0, separator).trim(),
          description: line.slice(separator + 3).trim(),
        }
      })
  }

  async #readDockerStream(
    stream: NodeJS.ReadableStream,
    timeoutMs: number
  ): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve, reject) => {
      const stdoutChunks: Buffer[] = []
      const stderrChunks: Buffer[] = []
      let settled = false

      const timer = setTimeout(() => {
        if (settled) return
        settled = true
        reject(new Error('Docker command timed out'))
      }, timeoutMs)

      stream.on('data', (chunk: Buffer) => {
        if (chunk.length <= 8) {
          return
        }

        const streamType = chunk[0]
        const payload = chunk.subarray(8)

        if (streamType === 1) {
          stdoutChunks.push(payload)
        } else if (streamType === 2) {
          stderrChunks.push(payload)
        } else {
          stdoutChunks.push(chunk)
        }
      })

      stream.on('end', () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve({
          stdout: Buffer.concat(stdoutChunks).toString('utf8'),
          stderr: Buffer.concat(stderrChunks).toString('utf8'),
          exitCode: 0,
        })
      })

      stream.on('error', (error) => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        reject(error)
      })
    })
  }
}
