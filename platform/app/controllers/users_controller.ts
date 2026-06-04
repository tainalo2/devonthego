import User from '#models/user'
import { createUserValidator, updateUserValidator } from '#validators/admin_user'
import type { HttpContext } from '@adonisjs/core/http'

export default class UsersController {
  async index({ inertia }: HttpContext) {
    const users = await User.query().orderBy('created_at', 'desc')

    return inertia.render('users/index', {
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt.toISO() ?? '',
      })),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('users/create', {})
  }

  async store({ request, response, session, i18n }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    await User.create({
      ...payload,
      isActive: payload.isActive ?? true,
    })
    session.flash('success', i18n.t('flash.users.created'))
    return response.redirect().toRoute('users.index')
  }

  async edit({ inertia, params }: HttpContext) {
    const user = await User.findOrFail(params.id)
    return inertia.render('users/edit', {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isActive: user.isActive,
      },
    })
  }

  async update({ request, response, params, session, i18n }: HttpContext) {
    const user = await User.findOrFail(params.id)
    const payload = await request.validateUsing(updateUserValidator, {
      meta: { userId: user.id },
    })

    user.merge({
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
      isActive: payload.isActive,
    })

    if (payload.password) {
      user.password = payload.password
    }

    await user.save()

    session.flash('success', i18n.t('flash.users.updated'))
    return response.redirect().toRoute('users.index')
  }

  async destroy({ params, response, session, auth, i18n }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (auth.user!.id === user.id) {
      session.flash('error', i18n.t('flash.users.cannot_delete_self'))
      return response.redirect().toRoute('users.index')
    }

    await user.delete()
    session.flash('success', i18n.t('flash.users.deleted'))
    return response.redirect().toRoute('users.index')
  }
}
