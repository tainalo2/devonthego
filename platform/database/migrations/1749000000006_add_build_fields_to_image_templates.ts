import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'image_templates'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.text('dockerfile').nullable()
      table
        .enum('build_status', ['idle', 'building', 'success', 'error'])
        .notNullable()
        .defaultTo('idle')
      table.text('build_error').nullable()
      table.timestamp('last_built_at').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('dockerfile')
      table.dropColumn('build_status')
      table.dropColumn('build_error')
      table.dropColumn('last_built_at')
    })
  }
}
