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

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator)
    await User.create({
      ...payload,
      isActive: payload.isActive ?? true,
    })
    session.flash('success', 'Utilisateur créé.')
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

  async update({ request, response, params, session }: HttpContext) {
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

    session.flash('success', 'Utilisateur mis à jour.')
    return response.redirect().toRoute('users.index')
  }

  async destroy({ params, response, session, auth }: HttpContext) {
    const user = await User.findOrFail(params.id)

    if (auth.user!.id === user.id) {
      session.flash('error', 'Vous ne pouvez pas supprimer votre propre compte.')
      return response.redirect().toRoute('users.index')
    }

    await user.delete()
    session.flash('success', 'Utilisateur supprimé.')
    return response.redirect().toRoute('users.index')
  }
}
