import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'environment_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table
        .integer('environment_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('environments')
        .onDelete('CASCADE')
      table.enum('level', ['info', 'warn', 'error']).notNullable().defaultTo('info')
      table.text('message').notNullable()

      table.timestamp('created_at').notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
