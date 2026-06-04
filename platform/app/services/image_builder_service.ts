import { execFile } from 'node:child_process'
import { mkdtemp, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'
import { DateTime } from 'luxon'
import dockerConfig from '#config/docker'
import ImageTemplate from '#models/image_template'
import SlugService from '#services/slug_service'

const execFileAsync = promisify(execFile)

export default class ImageBuilderService {
  async build(template: ImageTemplate): Promise<ImageTemplate> {
    template.buildStatus = 'building'
    template.buildError = null
    await template.save()

    const buildDir = await mkdtemp(join(tmpdir(), 'dotg-build-'))
    const localTag = template.dockerImage
    const registryTag = `${dockerConfig.registry}/${localTag}`

    try {
      const dockerfile =
        template.dockerfile?.trim() ||
        `FROM devonthego/base:latest\n\n# Ajoutez vos instructions ici\n`

      await writeFile(join(buildDir, 'Dockerfile'), dockerfile, 'utf8')

      await this.runDocker(['build', '-t', localTag, buildDir])
      await this.runDocker(['tag', localTag, registryTag])
      await this.runDocker(['push', registryTag])

      template.buildStatus = 'success'
      template.buildError = null
      template.lastBuiltAt = DateTime.now()
      await template.save()

      return template
    } catch (error) {
      template.buildStatus = 'error'
      template.buildError = error instanceof Error ? error.message : String(error)
      await template.save()
      throw error
    } finally {
      await rm(buildDir, { recursive: true, force: true })
    }
  }

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

  protected async runDocker(args: string[]) {
    const { stderr } = await execFileAsync('docker', args, {
      maxBuffer: 10 * 1024 * 1024,
    })

    if (stderr && !stderr.includes('Successfully') && !stderr.includes('Layer already exists')) {
      // docker écrit souvent sur stderr même en succès
    }
  }
}
