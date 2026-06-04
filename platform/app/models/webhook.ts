import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import WebhookDelivery from '#models/webhook_delivery'

export type WebhookEventName =
  | 'environment.created'
  | 'environment.started'
  | 'environment.stopped'
  | 'environment.error'
  | 'environment.updated'
  | 'environment.deleted'

export default class Webhook extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare url: string

  @column({ serializeAs: null })
  declare secret: string | null

  @column()
  declare events: WebhookEventName[]

  @column()
  declare isActive: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => WebhookDelivery)
  declare deliveries: HasMany<typeof WebhookDelivery>
}
