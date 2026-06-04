import env from '#start/env'
import User from '#models/user'
import ImageTemplate from '#models/image_template'
import EnvironmentService from '#services/environment_service'
import dockerConfig from '#config/docker'
import { createEnvironmentValidator } from '#validators/environment'
import type { HttpContext } from '@adonisjs/core/http'

export default class EnvironmentsController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const query = (await import('#models/environment')).default
      .query()
      .preload('owner')
      .preload('imageTemplate')
      .orderBy('created_at', 'desc')

    if (!user.isAdmin) {
      query.where((builder) => {
        builder.where('owner_id', user.id).orWhereHas('assignedUsers', (usersQuery) => {
          usersQuery.where('users.id', user.id)
        })
      })
    }

    const environments = await query

    return inertia.render('environments/index', {
      environments: environments.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        status: item.status,
        subdomain: item.subdomain,
        url: `https://${item.subdomain}.${dockerConfig.domain}`,
        owner: { id: item.owner.id, email: item.owner.email, fullName: item.owner.fullName },
        imageTemplate: item.imageTemplate
          ? { id: item.imageTemplate.id, name: item.imageTemplate.name }
          : null,
        cpuLimit: item.cpuLimit,
        memoryLimitMb: item.memoryLimitMb,
        createdAt: item.createdAt.toISO() ?? '',
      })),
    })
  }

  async create({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const templates = await ImageTemplate.query().orderBy('name')
    const users = user.isAdmin
      ? await User.query().where('is_active', true).orderBy('email')
      : []

    return inertia.render('environments/create', {
      templates: templates.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
        dockerImage: t.dockerImage,
        description: t.description,
        isDefault: t.isDefault,
      })),
      users: users.map((u) => ({ id: u.id, email: u.email, fullName: u.fullName, role: u.role })),
      defaults: {
        cpuLimit: dockerConfig.defaultCpuLimit,
        memoryLimitMb: 1024,
      },
    })
  }

  async store({ request, response, auth, session }: HttpContext) {
    const user = auth.user!
    const payload = await request.validateUsing(createEnvironmentValidator)
    const service = new EnvironmentService()

    const ownerId = user.isAdmin && payload.ownerId ? payload.ownerId : user.id

    try {
      const environment = await service.create({
        name: payload.name,
        ownerId,
        imageTemplateId: payload.imageTemplateId,
        cpuLimit: payload.cpuLimit,
        memoryLimitMb: payload.memoryLimitMb,
        assignedUserIds: payload.assignedUserIds,
      })

      session.flash('success', `Environnement « ${environment.name} » créé.`)
      session.flash('freshCredentials', '1')
      return response.redirect().toRoute('environments.show', { id: environment.id })
    } catch (error) {
      session.flash(
        'error',
        error instanceof Error ? error.message : "Impossible de créer l'environnement."
      )
      return response.redirect().back()
    }
  }

  async show({ inertia, auth, params, session }: HttpContext) {
    const user = auth.user!
    const Environment = (await import('#models/environment')).default
    const EnvironmentLog = (await import('#models/environment_log')).default
    const service = new EnvironmentService()

    const environment = await Environment.query()
      .where('id', params.id)
      .preload('owner')
      .preload('imageTemplate')
      .preload('assignedUsers')
      .firstOrFail()

    if (
      !user.isAdmin &&
      environment.ownerId !== user.id &&
      !environment.assignedUsers.some((u) => u.id === user.id)
    ) {
      return inertia.render('errors/not_found', {})
    }

    await service.syncStatus(environment)
    await environment.refresh()

    const logs = await EnvironmentLog.query()
      .where('environment_id', environment.id)
      .orderBy('created_at', 'desc')
      .limit(50)

    const revealCredentials =
      session.flashMessages.get('freshCredentials') === '1' ||
      session.flashMessages.get('freshCredentials') === true
    let credentials: { username: string; password: string } | null = null

    if (revealCredentials) {
      credentials = {
        username: environment.authUsername,
        password: service.getDecryptedPassword(environment),
      }
    }

    return inertia.render('environments/show', {
      environment: {
        id: environment.id,
        name: environment.name,
        slug: environment.slug,
        status: environment.status,
        subdomain: environment.subdomain,
        url: service.getPublicUrl(environment),
        dockerImage: environment.dockerImage,
        cpuLimit: environment.cpuLimit,
        memoryLimitMb: environment.memoryLimitMb,
        errorMessage: environment.errorMessage,
        owner: {
          id: environment.owner.id,
          email: environment.owner.email,
          fullName: environment.owner.fullName,
        },
        imageTemplate: environment.imageTemplate
          ? { id: environment.imageTemplate.id, name: environment.imageTemplate.name }
          : null,
        assignedUsers: environment.assignedUsers.map((u) => ({
          id: u.id,
          email: u.email,
          fullName: u.fullName,
        })),
        createdAt: environment.createdAt.toISO() ?? '',
      },
      credentials,
      logs: logs.map((log) => ({
        id: log.id,
        level: log.level,
        message: log.message,
        createdAt: log.createdAt.toISO() ?? '',
      })),
      domain: env.get('DOMAIN'),
    })
  }

  async start({ params, response, session }: HttpContext) {
    const Environment = (await import('#models/environment')).default
    const service = new EnvironmentService()
    const environment = await Environment.findOrFail(params.id)

    try {
      await service.start(environment)
      session.flash('success', 'Environnement démarré.')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Échec du démarrage.')
    }

    return response.redirect().toRoute('environments.show', { id: environment.id })
  }

  async stop({ params, response, session }: HttpContext) {
    const Environment = (await import('#models/environment')).default
    const service = new EnvironmentService()
    const environment = await Environment.findOrFail(params.id)

    try {
      await service.stop(environment)
      session.flash('success', 'Environnement arrêté.')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : "Échec de l'arrêt.")
    }

    return response.redirect().toRoute('environments.show', { id: environment.id })
  }

  async destroy({ params, response, session }: HttpContext) {
    const Environment = (await import('#models/environment')).default
    const service = new EnvironmentService()
    const environment = await Environment.findOrFail(params.id)

    try {
      await service.delete(environment)
      session.flash('success', 'Environnement supprimé.')
      return response.redirect().toRoute('environments.index')
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Échec de la suppression.')
      return response.redirect().toRoute('environments.show', { id: environment.id })
    }
  }

  async regenerateCredentials({ params, response, session }: HttpContext) {
    const Environment = (await import('#models/environment')).default
    const service = new EnvironmentService()
    const environment = await Environment.findOrFail(params.id)

    try {
      await service.regenerateCredentials(environment)
      session.flash('success', 'Identifiants régénérés.')
      session.flash('freshCredentials', true)
    } catch (error) {
      session.flash('error', error instanceof Error ? error.message : 'Échec de la régénération.')
    }

    return response.redirect().toRoute('environments.show', { id: environment.id })
  }
}
