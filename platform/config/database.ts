import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'

const dbConnection = env.get('DB_CONNECTION', 'sqlite')

const sqliteFilename = env.get('DB_DATABASE') ?? app.tmpPath('db.sqlite3')

const dbConfig = defineConfig({
  connection: dbConnection,

  connections: {
    sqlite: {
      client: 'better-sqlite3',
      connection: {
        filename: sqliteFilename,
      },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },

    libsql: {
      client: 'libsql',
      connection: {
        filename: sqliteFilename,
      } as { filename: string },
      useNullAsDefault: true,
      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },
    },
  },
})

export default dbConfig
