import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Environment from '#models/environment'

export type EnvironmentModuleStatus =
  | 'pending'
  | 'installing'
  | 'installed'
  | 'removing'
  | 'failed'

export type EnvironmentModuleSource = 'curated' | 'debian'
export type EnvironmentModuleInstallType = 'apt' | 'script' | 'npm'

export default class EnvironmentModule extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare environmentId: number

  @column()
  declare moduleKey: string

  @column()
  declare displayName: string

  @column()
  declare description: string | null

  @column()
  declare source: EnvironmentModuleSource

  @column()
  declare installType: EnvironmentModuleInstallType

  @column()
  declare packageRef: string

  @column()
  declare status: EnvironmentModuleStatus

  @column()
  declare errorMessage: string | null

  @column.dateTime()
  declare installedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => Environment)
  declare environment: BelongsTo<typeof Environment>
}
