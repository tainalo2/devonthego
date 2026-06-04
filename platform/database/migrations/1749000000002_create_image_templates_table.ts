import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'image_templates'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').notNullable()
      table.string('name').notNullable()
      table.string('slug').notNullable().unique()
      table.string('docker_image').notNullable()
      table.text('description').nullable()
      table.json('extensions').nullable()
      table.boolean('is_default').notNullable().defaultTo(false)
      table.boolean('is_builtin').notNullable().defaultTo(false)

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
