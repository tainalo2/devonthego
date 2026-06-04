import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'environments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table
        .enum('status', ['creating', 'running', 'stopped', 'error', 'deleting'])
        .notNullable()
        .defaultTo('creating')
      table.string('container_id').nullable()
      table.string('container_name').nullable()
      table.string('subdomain').notNullable()
      table.string('docker_image').notNullable()
      table.string('auth_username').notNullable()
      table.text('auth_password').notNullable()
      table.string('connection_token').nullable()
      table.integer('cpu_limit').notNullable().defaultTo(1)
      table.integer('memory_limit_mb').notNullable().defaultTo(1024)
      table.text('error_message').nullable()

      table
        .integer('owner_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table
        .integer('image_template_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('image_templates')
        .onDelete('SET NULL')

      table.timestamp('last_accessed_at').nullable()
      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
