import User from '#models/user'
import SetupService from '#services/setup_service'
import env from '#start/env'
import { signupValidator } from '#validators/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class NewAccountController {
  async create({ inertia, response, session, i18n }: HttpContext) {
    if (!(await SetupService.isCompleted())) {
      session.flash('error', i18n.t('flash.account.setup_required'))
      return response.redirect().toRoute('session.create')
    }

    const allowPublicSignup = env.get('ALLOW_PUBLIC_SIGNUP', false)
    const usersCount = await User.query().count('* as total')
    const hasUsers = Number(usersCount[0]?.$extras?.total ?? 0) > 0

    if (!allowPublicSignup && hasUsers) {
      return response.redirect().toRoute('session.create')
    }

    return inertia.render('auth/signup', {})
  }

  async store({ request, response, auth, session, i18n }: HttpContext) {
    if (!(await SetupService.isCompleted())) {
      session.flash('error', i18n.t('flash.account.setup_required'))
      return response.redirect().toRoute('session.create')
    }

    const allowPublicSignup = env.get('ALLOW_PUBLIC_SIGNUP', false)
    const usersCount = await User.query().count('* as total')
    const hasUsers = Number(usersCount[0]?.$extras?.total ?? 0) > 0

    if (!allowPublicSignup && hasUsers) {
      session.flash('error', i18n.t('flash.account.signup_disabled'))
      return response.redirect().toRoute('session.create')
    }

    const payload = await request.validateUsing(signupValidator)
    const user = await User.create({
      ...payload,
      role: hasUsers ? 'user' : 'admin',
      isActive: true,
    })

    await auth.use('web').login(user)
    response.redirect().toRoute('dashboard.index')
  }
}
