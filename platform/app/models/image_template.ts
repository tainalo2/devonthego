import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Environment from '#models/environment'

export default class ImageTemplate extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare dockerImage: string

  @column()
  declare description: string | null

  @column()
  declare extensions: string[] | null

  @column()
  declare isDefault: boolean

  @column()
  declare isBuiltin: boolean

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @hasMany(() => Environment)
  declare environments: HasMany<typeof Environment>
}
