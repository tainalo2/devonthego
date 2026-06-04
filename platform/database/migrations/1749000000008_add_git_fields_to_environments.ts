import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'environments'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('git_repo_url').nullable()
      table.string('git_branch').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('git_repo_url')
      table.dropColumn('git_branch')
    })
  }
}
