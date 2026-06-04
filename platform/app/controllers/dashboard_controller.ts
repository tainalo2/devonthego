import User from '#models/user'
import ImageTemplate from '#models/image_template'
import Environment from '#models/environment'
import EnvironmentService from '#services/environment_service'
import dockerConfig from '#config/docker'
import DockerService from '#services/docker_service'
import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const docker = new DockerService()
    const envService = new EnvironmentService()

    if (user.isAdmin) {
      await envService.syncAll()
    }

    const environmentsQuery = Environment.query()
      .preload('owner')
      .preload('imageTemplate')
      .orderBy('created_at', 'desc')

    if (!user.isAdmin) {
      environmentsQuery.where((query) => {
        query.where('owner_id', user.id).orWhereHas('assignedUsers', (usersQuery) => {
          usersQuery.where('users.id', user.id)
        })
      })
    }

    const [environments, usersCount, templatesCount, dockerOnline] = await Promise.all([
      environmentsQuery.limit(50),
      user.isAdmin ? User.query().count('* as total') : Promise.resolve([{ $extras: { total: 0 } }]),
      ImageTemplate.query().count('* as total'),
      docker.ping(),
    ])

    const stats = {
      environmentsTotal: environments.length,
      environmentsRunning: environments.filter((e) => e.status === 'running').length,
      usersTotal: Number(usersCount[0]?.$extras?.total ?? 0),
      templatesTotal: Number(templatesCount[0]?.$extras?.total ?? 0),
      dockerOnline,
      domain: dockerConfig.domain,
    }

    return inertia.render('dashboard/index', {
      environments: environments.map((env) => ({
        id: env.id,
        name: env.name,
        slug: env.slug,
        status: env.status,
        subdomain: env.subdomain,
        url: `https://${env.subdomain}.${dockerConfig.domain}`,
        owner: env.owner ? { id: env.owner.id, email: env.owner.email, fullName: env.owner.fullName } : null,
        imageTemplate: env.imageTemplate ? { id: env.imageTemplate.id, name: env.imageTemplate.name } : null,
        createdAt: env.createdAt.toISO() ?? '',
      })),
      stats,
    })
  }
}
