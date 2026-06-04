import { createHmac, randomBytes } from 'node:crypto'
import Webhook from '#models/webhook'
import WebhookDelivery from '#models/webhook_delivery'

export type WebhookEvent =
  | 'environment.created'
  | 'environment.started'
  | 'environment.stopped'
  | 'environment.error'
  | 'environment.updated'
  | 'environment.deleted'

export type WebhookPayload = {
  event: WebhookEvent
  timestamp: string
  data: Record<string, unknown>
}

export default class WebhookService {
  async dispatch(event: WebhookEvent, data: Record<string, unknown>): Promise<void> {
    const webhooks = await Webhook.query().where('is_active', true)

    const payload: WebhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data,
    }

    for (const webhook of webhooks) {
      if (!webhook.events.includes(event)) {
        continue
      }

      void this.deliver(webhook, payload)
    }
  }

  protected async deliver(webhook: Webhook, payload: WebhookPayload) {
    const body = JSON.stringify(payload)
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'Dev-on-the-go-Webhook/1.0',
      'X-DOTG-Event': payload.event,
      'X-DOTG-Delivery': randomBytes(16).toString('hex'),
    }

    if (webhook.secret) {
      const signature = createHmac('sha256', webhook.secret).update(body).digest('hex')
      headers['X-DOTG-Signature'] = `sha256=${signature}`
    }

    let responseStatus: number | null = null
    let responseBody: string | null = null
    let success = false

    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers,
        body,
        signal: AbortSignal.timeout(10_000),
      })

      responseStatus = response.status
      responseBody = (await response.text()).slice(0, 2000)
      success = response.ok
    } catch (error) {
      responseBody = error instanceof Error ? error.message : String(error)
    }

    await WebhookDelivery.create({
      webhookId: webhook.id,
      event: payload.event,
      payload: body,
      responseStatus,
      responseBody,
      success,
    })
  }
}
