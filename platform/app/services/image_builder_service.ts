import { spawn } from 'node:child_process'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { DateTime } from 'luxon'
import dockerConfig from '#config/docker'
import ImageTemplate from '#models/image_template'
import SlugService from '#services/slug_service'

export default class ImageBuilderService {
  static dockerImageForSlug(slug: string): string {
    return `devonthego/custom:${slug}-latest`
  }

  static defaultDockerfile(baseImage = 'devonthego/base:latest'): string {
    return `FROM ${baseImage}\n\nUSER root\nRUN echo "Custom image Dev on the go"\nUSER openvscode-server\n`
  }

  static slugFromName(name: string): string {
    const slug = SlugService.slugify(name)
    return slug || `custom-${SlugService.randomSuffix()}`
  }

  /** Lance un build en arrière-plan et retourne immédiatement. */
  startBuildAsync(templateId: number): void {
    void this.runBuild(templateId)
  }

  async build(template: ImageTemplate): Promise<ImageTemplate> {
    await this.prepareBuild(template)
    return this.executeBuild(template)
  }

  protected async runBuild(templateId: number) {
    const template = await ImageTemplate.find(templateId)
    if (!template) return

    try {
      await this.prepareBuild(template)
      await this.executeBuild(template)
    } catch {
      // erreurs déjà persistées dans executeBuild / prepareBuild
    }
  }

  protected async prepareBuild(template: ImageTemplate) {
    template.buildStatus = 'building'
    template.buildError = null
    template.buildLog = `[${new Date().toISOString()}] Build démarré…\n`
    await template.save()
  }

  protected async executeBuild(template: ImageTemplate): Promise<ImageTemplate> {
    const buildDir = await mkdtemp(join(tmpdir(), 'dotg-build-'))
    const localTag = template.dockerImage
    const registryTag = `${dockerConfig.registry}/${localTag}`

    try {
      const dockerfile =
        template.dockerfile?.trim() ||
        `FROM devonthego/base:latest\n\n# Ajoutez vos instructions ici\n`

      await writeFile(join(buildDir, 'Dockerfile'), dockerfile, 'utf8')
      await this.appendLog(template, `Dockerfile écrit dans ${buildDir}`)

      await this.runDockerStreaming(template, ['build', '-t', localTag, buildDir])
      await this.appendLog(template, `Image taguée localement : ${localTag}`)

      await this.runDockerStreaming(template, ['tag', localTag, registryTag])
      await this.appendLog(template, `Push vers ${registryTag}…`)

      await this.runDockerStreaming(template, ['push', registryTag])

      template.buildStatus = 'success'
      template.buildError = null
      template.lastBuiltAt = DateTime.now()
      await this.appendLog(template, 'Build terminé avec succès.')
      await template.save()

      return template
    } catch (error) {
      template.buildStatus = 'error'
      template.buildError = error instanceof Error ? error.message : String(error)
      await this.appendLog(template, `ERREUR : ${template.buildError}`)
      await template.save()
      throw error
    } finally {
      await rm(buildDir, { recursive: true, force: true })
    }
  }

  protected async appendLog(template: ImageTemplate, line: string) {
    const entry = `[${new Date().toISOString()}] ${line}\n`
    template.buildLog = (template.buildLog ?? '') + entry
    await template.save()
  }

  protected runDockerStreaming(template: ImageTemplate, args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const proc = spawn('docker', args, { stdio: ['ignore', 'pipe', 'pipe'] })

      const onData = (chunk: Buffer) => {
        const text = chunk.toString('utf8').trim()
        if (text) {
          void this.appendLog(template, text)
        }
      }

      proc.stdout.on('data', onData)
      proc.stderr.on('data', onData)

      proc.on('error', reject)
      proc.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`docker ${args[0]} a échoué (code ${code})`))
        }
      })
    })
  }
}
