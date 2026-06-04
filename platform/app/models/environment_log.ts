import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Environment from '#models/environment'

export default class EnvironmentLog extends BaseModel {
  static table = 'environment_logs'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare environmentId: number

  @column()
  declare level: 'info' | 'warn' | 'error'

  @column()
  declare message: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Environment)
  declare environment: BelongsTo<typeof Environment>
}
