import { randomBytes } from 'node:crypto'
import encryption from '@adonisjs/core/services/encryption'
import dockerConfig from '#config/docker'
import Environment from '#models/environment'
import EnvironmentLog from '#models/environment_log'
import ImageTemplate from '#models/image_template'
import User from '#models/user'
import DockerService from '#services/docker_service'
import SlugService from '#services/slug_service'
import TraefikAuthService from '#services/traefik_auth_service'

export type CreateEnvironmentInput = {
  name: string
  ownerId: number
  imageTemplateId?: number
  dockerImage?: string
  cpuLimit?: number
  memoryLimitMb?: number
  assignedUserIds?: number[]
}

export default class EnvironmentService {
  constructor(protected docker = new DockerService()) {}

  async create(input: CreateEnvironmentInput): Promise<Environment> {
    const owner = await User.findOrFail(input.ownerId)
    let dockerImage = input.dockerImage

    if (input.imageTemplateId) {
      const template = await ImageTemplate.findOrFail(input.imageTemplateId)
      dockerImage = template.dockerImage
    }

    if (!dockerImage) {
      const defaultTemplate = await ImageTemplate.query().where('is_default', true).first()
      dockerImage = defaultTemplate?.dockerImage ?? `${dockerConfig.imagePrefix}/base:latest`
    }

    const baseSlug = SlugService.slugify(input.name) || 'env'
    const slug = `${baseSlug}-${SlugService.randomSuffix()}`
    const subdomain = slug
    const authUsername = 'dev'
    const authPassword = randomBytes(12).toString('base64url')
    const connectionToken = randomBytes(24).toString('hex')

    const environment = await Environment.create({
      name: input.name,
      slug,
      status: 'creating',
      subdomain,
      dockerImage,
      authUsername,
      authPassword: encryption.encrypt(authPassword),
      connectionToken,
      cpuLimit: input.cpuLimit ?? dockerConfig.defaultCpuLimit,
      memoryLimitMb: input.memoryLimitMb ?? 1024,
      ownerId: owner.id,
      imageTemplateId: input.imageTemplateId ?? null,
    })

    if (input.assignedUserIds?.length) {
      await environment.related('assignedUsers').attach(
        Object.fromEntries(input.assignedUserIds.map((id) => [id, { access_level: 'write' }]))
      )
    }

    await this.log(environment.id, 'info', `Création de l'environnement « ${environment.name} »`)

    try {
      const container = await this.startContainer(environment, authPassword)
      environment.containerId = container.id
      environment.containerName = container.name
      environment.status = 'running'
      await environment.save()
      await this.log(environment.id, 'info', 'Conteneur démarré avec succès')
    } catch (error) {
      environment.status = 'error'
      environment.errorMessage = error instanceof Error ? error.message : String(error)
      await environment.save()
      await this.log(environment.id, 'error', environment.errorMessage)
      throw error
    }

    return environment
  }

  async start(environment: Environment): Promise<Environment> {
    if (environment.containerId) {
      const container = this.docker.client.getContainer(environment.containerId)
      await container.start()
      environment.status = 'running'
      await environment.save()
      await this.log(environment.id, 'info', 'Environnement démarré')
      return environment
    }

    const authPassword = encryption.decrypt(environment.authPassword) as string
    const container = await this.startContainer(environment, authPassword)
    environment.containerId = container.id
    environment.containerName = container.name
    environment.status = 'running'
    await environment.save()
    return environment
  }

  async stop(environment: Environment): Promise<Environment> {
    if (!environment.containerId) {
      environment.status = 'stopped'
      await environment.save()
      return environment
    }

    const container = this.docker.client.getContainer(environment.containerId)
    await container.stop({ t: 5 })
    environment.status = 'stopped'
    await environment.save()
    await this.log(environment.id, 'info', 'Environnement arrêté')
    return environment
  }

  async delete(environment: Environment): Promise<void> {
    environment.status = 'deleting'
    await environment.save()

    if (environment.containerId) {
      await this.docker.removeContainer(environment.containerId)
    }

    await this.log(environment.id, 'info', 'Environnement supprimé')
    await environment.delete()
  }

  async syncStatus(environment: Environment): Promise<Environment> {
    if (!environment.containerId) {
      return environment
    }

    try {
      const info = await this.docker.inspectContainer(environment.containerId)
      environment.status = info.State.Running ? 'running' : 'stopped'
      environment.errorMessage = null
      await environment.save()
    } catch {
      environment.status = 'error'
      environment.errorMessage = 'Conteneur introuvable'
      await environment.save()
    }

    return environment
  }

  async syncAll(): Promise<number> {
    const environments = await Environment.query().whereNot('status', 'deleting')
    let updated = 0

    for (const environment of environments) {
      const before = environment.status
      await this.syncStatus(environment)
      if (before !== environment.status) {
        updated++
      }
    }

    return updated
  }

  async assignUsers(environment: Environment, userIds: number[]): Promise<void> {
    const uniqueIds = [...new Set(userIds.filter((id) => id !== environment.ownerId))]
    await environment.related('assignedUsers').sync(
      Object.fromEntries(uniqueIds.map((id) => [id, { access_level: 'write' }]))
    )
    await this.log(
      environment.id,
      'info',
      `Utilisateurs assignés mis à jour (${uniqueIds.length})`
    )
  }

  async getDockerLogs(environment: Environment, tail = 100): Promise<string | null> {
    if (!environment.containerId) {
      return null
    }

    try {
      return await this.docker.getContainerLogs(environment.containerId, tail)
    } catch {
      return null
    }
  }

  async regenerateCredentials(environment: Environment): Promise<{ username: string; password: string }> {
    const authPassword = randomBytes(12).toString('base64url')
    environment.authPassword = encryption.encrypt(authPassword)
    await environment.save()

    if (environment.containerId) {
      await this.docker.removeContainer(environment.containerId)
      environment.containerId = null
      environment.containerName = null
    }

    await this.start(environment)
    await this.log(environment.id, 'info', 'Identifiants régénérés')

    return { username: environment.authUsername, password: authPassword }
  }

  getPublicUrl(environment: Environment): string {
    return `https://${environment.subdomain}.${dockerConfig.domain}`
  }

  getDecryptedPassword(environment: Environment): string {
    return encryption.decrypt(environment.authPassword) as string
  }

  protected async startContainer(environment: Environment, authPassword: string) {
    const containerName = `dotg-env-${environment.slug}`
    const hostRule = `Host(\`${environment.subdomain}.${dockerConfig.domain}\`)`
    const authHash = TraefikAuthService.hashPassword(environment.authUsername, authPassword)
    const authLabel = TraefikAuthService.escapeForDockerLabel(authHash)
    const routerName = `env-${environment.slug}`
    const middlewareName = `env-${environment.slug}-auth`
    const workspaceVolume = `${dockerConfig.workspacePath}/${environment.slug}`

    const container = await this.docker.client.createContainer({
      name: containerName,
      Image: environment.dockerImage,
      Env: [`CONNECTION_TOKEN=${environment.connectionToken}`],
      HostConfig: {
        NetworkMode: dockerConfig.network,
        Binds: [`${workspaceVolume}:/home/workspace`],
        NanoCpus: environment.cpuLimit * 1e9,
        Memory: environment.memoryLimitMb * 1024 * 1024,
        RestartPolicy: { Name: 'unless-stopped' },
      },
      Labels: {
        'devonthego.managed': 'true',
        'devonthego.environment_id': String(environment.id),
        'traefik.enable': 'true',
        [`traefik.http.routers.${routerName}.rule`]: hostRule,
        [`traefik.http.routers.${routerName}.entrypoints`]: 'websecure',
        [`traefik.http.routers.${routerName}.tls`]: 'true',
        [`traefik.http.routers.${routerName}.tls.certresolver`]: 'letsencrypt',
        [`traefik.http.routers.${routerName}.middlewares`]: middlewareName,
        [`traefik.http.middlewares.${middlewareName}.basicauth.users`]: authLabel,
        [`traefik.http.services.${routerName}.loadbalancer.server.port`]: '3000',
      },
    })

    await container.start()
    const inspect = await container.inspect()

    return { id: inspect.Id, name: inspect.Name.replace(/^\//, '') }
  }

  protected async log(environmentId: number, level: 'info' | 'warn' | 'error', message: string) {
    await EnvironmentLog.create({ environmentId, level, message })
  }
}
