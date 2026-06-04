import SetupService from '#services/setup_service'
import env from '#start/env'
import { setupValidator } from '#validators/setup'
import type { HttpContext } from '@adonisjs/core/http'

export default class SetupController {
  async index({ inertia, auth }: HttpContext) {
    const user = auth.user!
    const envValues = await SetupService.readEnvFile()

    return inertia.render('setup/index', {
      defaults: {
        domain: envValues.get('DOMAIN') === 'bootstrap.local' ? '' : (envValues.get('DOMAIN') ?? ''),
        acmeEmail: envValues.get('ACME_EMAIL') ?? '',
        adminEmail: user.email.includes('bootstrap.local') ? '' : user.email,
        adminFullName: user.fullName === 'Bootstrap Admin' ? '' : (user.fullName ?? ''),
        allowPublicSignup: envValues.get('ALLOW_PUBLIC_SIGNUP') === 'true',
        envCpuLimit: Number(envValues.get('ENV_CPU_LIMIT') ?? env.get('ENV_CPU_LIMIT', 1)),
        envMemoryLimit: envValues.get('ENV_MEMORY_LIMIT') ?? env.get('ENV_MEMORY_LIMIT', '1024m'),
      },
      bootstrapUrl: env.get('APP_URL', 'http://localhost:8080'),
    })
  }

  async store({ request, auth, response, session, inertia }: HttpContext) {
    const user = auth.user!

    if (user.role !== 'admin') {
      session.flash('error', 'Seul un administrateur peut finaliser la configuration.')
      return response.redirect().back()
    }

    const payload = await request.validateUsing(setupValidator)

    try {
      const { appUrl } = await SetupService.completeSetup(
        {
          domain: payload.domain,
          acmeEmail: payload.acmeEmail,
          adminEmail: payload.adminEmail,
          adminFullName: payload.adminFullName,
          adminPassword: payload.adminPassword,
          allowPublicSignup: payload.allowPublicSignup,
          envCpuLimit: payload.envCpuLimit,
          envMemoryLimit: payload.envMemoryLimit,
        },
        user
      )

      return inertia.render('setup/complete', { appUrl })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erreur inconnue'
      session.flash('error', `Échec du déploiement : ${message}`)
      return response.redirect().back()
    }
  }
}
