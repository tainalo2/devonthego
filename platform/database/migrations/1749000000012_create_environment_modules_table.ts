import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'environment_modules'

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
      table.string('module_key').notNullable()
      table.string('display_name').notNullable()
      table.text('description').nullable()
      table.string('source').notNullable()
      table.string('install_type').notNullable()
      table.string('package_ref').notNullable()
      table
        .string('status')
        .notNullable()
        .defaultTo('pending')
      table.text('error_message').nullable()
      table.timestamp('installed_at').nullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()

      table.unique(['environment_id', 'module_key'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
