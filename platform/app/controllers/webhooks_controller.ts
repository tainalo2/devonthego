import { randomBytes } from 'node:crypto'
import Webhook from '#models/webhook'
import WebhookDelivery from '#models/webhook_delivery'
import { createWebhookValidator, updateWebhookValidator, WEBHOOK_EVENTS } from '#validators/webhook'
import type { HttpContext } from '@adonisjs/core/http'

export default class WebhooksController {
  async index({ inertia }: HttpContext) {
    const webhooks = await Webhook.query().orderBy('created_at', 'desc')

    return inertia.render('webhooks/index', {
      webhooks: webhooks.map((w) => ({
        id: w.id,
        name: w.name,
        url: w.url,
        events: w.events,
        isActive: w.isActive,
        createdAt: w.createdAt.toISO() ?? '',
      })),
      availableEvents: [...WEBHOOK_EVENTS],
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('webhooks/create', {
      availableEvents: [...WEBHOOK_EVENTS],
    })
  }

  async store({ request, response, session }: HttpContext) {
    const payload = await request.validateUsing(createWebhookValidator)

    await Webhook.create({
      name: payload.name,
      url: payload.url,
      secret: payload.secret ?? randomBytes(24).toString('hex'),
      events: payload.events,
      isActive: payload.isActive ?? true,
    })

    session.flash('success', 'Webhook créé.')
    return response.redirect().toRoute('webhooks.index')
  }

  async show({ inertia, params }: HttpContext) {
    const webhook = await Webhook.findOrFail(params.id)
    const deliveries = await WebhookDelivery.query()
      .where('webhook_id', webhook.id)
      .orderBy('created_at', 'desc')
      .limit(30)

    return inertia.render('webhooks/show', {
      webhook: {
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        secret: webhook.secret,
        events: webhook.events,
        isActive: webhook.isActive,
        createdAt: webhook.createdAt.toISO() ?? '',
      },
      deliveries: deliveries.map((d) => ({
        id: d.id,
        event: d.event,
        success: d.success,
        responseStatus: d.responseStatus,
        responseBody: d.responseBody,
        createdAt: d.createdAt.toISO() ?? '',
      })),
    })
  }

  async edit({ inertia, params }: HttpContext) {
    const webhook = await Webhook.findOrFail(params.id)

    return inertia.render('webhooks/edit', {
      webhook: {
        id: webhook.id,
        name: webhook.name,
        url: webhook.url,
        events: webhook.events,
        isActive: webhook.isActive,
      },
      availableEvents: [...WEBHOOK_EVENTS],
    })
  }

  async update({ request, response, params, session }: HttpContext) {
    const webhook = await Webhook.findOrFail(params.id)
    const payload = await request.validateUsing(updateWebhookValidator)

    webhook.merge({
      name: payload.name ?? webhook.name,
      url: payload.url ?? webhook.url,
      events: payload.events ?? webhook.events,
      isActive: payload.isActive ?? webhook.isActive,
    })

    if (payload.secret) {
      webhook.secret = payload.secret
    }

    await webhook.save()
    session.flash('success', 'Webhook mis à jour.')
    return response.redirect().toRoute('webhooks.show', { id: webhook.id })
  }

  async destroy({ response, params, session }: HttpContext) {
    const webhook = await Webhook.findOrFail(params.id)
    await webhook.delete()
    session.flash('success', 'Webhook supprimé.')
    return response.redirect().toRoute('webhooks.index')
  }
}
