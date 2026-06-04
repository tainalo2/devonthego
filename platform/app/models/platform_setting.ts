import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class PlatformSetting extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare setupCompleted: boolean

  @column.dateTime()
  declare setupCompletedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  static async getSingleton() {
    let settings = await this.first()
    if (!settings) {
      settings = await this.create({ setupCompleted: false })
    }
    return settings
  }
}
