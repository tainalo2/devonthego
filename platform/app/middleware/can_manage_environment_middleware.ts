import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class CanManageEnvironmentMiddleware {
  async handle({ auth, params, response, i18n }: HttpContext, next: NextFn) {
    const user = auth.user!
    if (user.isAdmin) {
      return next()
    }

    const Environment = (await import('#models/environment')).default
    const environment = await Environment.query()
      .where('id', params.id)
      .where((query) => {
        query.where('owner_id', user.id).orWhereHas('assignedUsers', (usersQuery) => {
          usersQuery.where('users.id', user.id)
        })
      })
      .first()

    if (!environment) {
      return response.forbidden({ error: i18n.t('messages.errors.env_access_denied') })
    }

    return next()
  }
}
