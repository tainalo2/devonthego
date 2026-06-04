import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ auth, response, i18n }: HttpContext, next: NextFn) {
    const user = auth.user
    if (!user?.isAdmin) {
      return response.forbidden({ error: i18n.t('messages.errors.admin_only') })
    }
    return next()
  }
}
