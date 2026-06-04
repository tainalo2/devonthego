import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Webhook from '#models/webhook'

export default class WebhookDelivery extends BaseModel {
  static table = 'webhook_deliveries'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare webhookId: number

  @column()
  declare event: string

  @column()
  declare payload: string

  @column()
  declare responseStatus: number | null

  @column()
  declare responseBody: string | null

  @column()
  declare success: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Webhook)
  declare webhook: BelongsTo<typeof Webhook>
}
