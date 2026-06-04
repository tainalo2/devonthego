import vine from '@vinejs/vine'

const webhookEvents = [
  'environment.created',
  'environment.started',
  'environment.stopped',
  'environment.error',
  'environment.updated',
  'environment.deleted',
] as const

export const createWebhookValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(80),
    url: vine.string().trim().url(),
    secret: vine.string().trim().maxLength(128).optional(),
    events: vine.array(vine.enum(webhookEvents)).minLength(1),
    isActive: vine.boolean().optional(),
  })
)

export const updateWebhookValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(80).optional(),
    url: vine.string().trim().url().optional(),
    secret: vine.string().trim().maxLength(128).optional(),
    events: vine.array(vine.enum(webhookEvents)).minLength(1).optional(),
    isActive: vine.boolean().optional(),
  })
)

export const WEBHOOK_EVENTS = webhookEvents
