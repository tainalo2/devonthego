import User from '#models/user'
import SetupService from '#services/setup_service'
import env from '#start/env'
import type { HttpContext } from '@adonisjs/core/http'

export default class SessionController {
  async create({ inertia }: HttpContext) {
    const bootstrapMode = env.get('BOOTSTRAP_MODE', false) && !(await SetupService.isCompleted())
    return inertia.render('auth/login', { bootstrapMode })
  }

  async store({ request, auth, response }: HttpContext) {
    const { email, password } = request.all()
    const user = await User.verifyCredentials(email, password)

    await auth.use('web').login(user)

    if (!(await SetupService.isCompleted())) {
      return response.redirect().toRoute('setup.index')
    }

    response.redirect().toRoute('dashboard.index')
  }

  async destroy({ auth, response }: HttpContext) {
    await auth.use('web').logout()
    response.redirect().toRoute('session.create')
  }
}
