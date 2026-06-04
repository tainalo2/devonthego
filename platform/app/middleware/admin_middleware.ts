import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ auth, response }: HttpContext, next: NextFn) {
    const user = auth.user
    if (!user?.isAdmin) {
      return response.forbidden({ error: 'Accès réservé aux administrateurs.' })
    }
    return next()
  }
}
