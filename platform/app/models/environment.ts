import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import EnvironmentModule from '#models/environment_module'
import ImageTemplate from '#models/image_template'
import User from '#models/user'

export type EnvironmentStatus = 'creating' | 'running' | 'stopped' | 'error' | 'deleting'

export default class Environment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare status: EnvironmentStatus

  @column()
  declare containerId: string | null

  @column()
  declare containerName: string | null

  @column()
  declare subdomain: string

  @column()
  declare dockerImage: string

  @column()
  declare authUsername: string

  @column({ serializeAs: null })
  declare authPassword: string

  @column({ serializeAs: null })
  declare connectionToken: string | null

  @column()
  declare cpuLimit: number

  @column()
  declare memoryLimitMb: number

  @column()
  declare errorMessage: string | null

  @column()
  declare ownerId: number

  @column()
  declare imageTemplateId: number | null

  @column()
  declare gitRepoUrl: string | null

  @column()
  declare gitBranch: string | null

  @column.dateTime()
  declare lastAccessedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @belongsTo(() => ImageTemplate)
  declare imageTemplate: BelongsTo<typeof ImageTemplate>

  @manyToMany(() => User, {
    pivotTable: 'environment_users',
    pivotColumns: ['access_level'],
  })
  declare assignedUsers: ManyToMany<typeof User>

  @hasMany(() => EnvironmentModule)
  declare modules: HasMany<typeof EnvironmentModule>
}
