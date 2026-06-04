import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'
import SetupService from '#services/setup_service'

/**
 * Guest middleware is used to deny access to routes that should
 * be accessed by unauthenticated users.
 */
export default class GuestMiddleware {
  redirectTo = '/'

  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    for (let guard of options.guards || [ctx.auth.defaultGuard]) {
      if (await ctx.auth.use(guard).check()) {
        ctx.session.reflash()
        if (!(await SetupService.isCompleted())) {
          return ctx.response.redirect().toRoute('setup.index')
        }
        return ctx.response.redirect().toRoute('dashboard.index')
      }
    }

    return next()
  }
}
