import env from '#start/env'
import dockerConfig from '#config/docker'
import type { HttpContext } from '@adonisjs/core/http'

export default class SettingsController {
  async index({ inertia }: HttpContext) {
    return inertia.render('settings/index', {
      settings: {
        domain: dockerConfig.domain,
        dockerNetwork: dockerConfig.network,
        dockerRegistry: dockerConfig.registry,
        workspacePath: dockerConfig.workspacePath,
        defaultCpuLimit: dockerConfig.defaultCpuLimit,
        defaultMemoryLimit: dockerConfig.defaultMemoryLimit,
        allowPublicSignup: env.get('ALLOW_PUBLIC_SIGNUP', false),
        dbConnection: env.get('DB_CONNECTION'),
        appUrl: env.get('APP_URL'),
      },
    })
  }
}
