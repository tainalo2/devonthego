import SetupService from '#services/setup_service'
import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

const AUTH_ROUTES = new Set(['session.create', 'session.store', 'home'])

export default class SetupMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const routeName = ctx.route?.name ?? ''
    const isSetupRoute = routeName.startsWith('setup.')
    const isAuthRoute = AUTH_ROUTES.has(routeName)

    const completed = await SetupService.isCompleted()

    if (!completed) {
      if (isSetupRoute) {
        if (!ctx.auth.user) {
          return ctx.response.redirect().toRoute('session.create')
        }
        if (ctx.auth.user.role !== 'admin') {
          return ctx.response.redirect().toRoute('session.create')
        }
        return next()
      }

      if (isAuthRoute) {
        return next()
      }

      if (ctx.auth.user) {
        return ctx.response.redirect().toRoute('setup.index')
      }

      return ctx.response.redirect().toRoute('session.create')
    }

    if (isSetupRoute) {
      return ctx.response.redirect().toRoute('dashboard.index')
    }

    return next()
  }
}
