import Docker from 'dockerode'
import dockerConfig from '#config/docker'

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
}
