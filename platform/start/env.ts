/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'

export default await Env.create(new URL('../', import.meta.url), {
  // Node
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.string(),

  // App
  APP_KEY: Env.schema.secret(),
  APP_URL: Env.schema.string.optional({ format: 'url', tld: false }),
  DOMAIN: Env.schema.string.optional(),
  ALLOW_PUBLIC_SIGNUP: Env.schema.boolean.optional(),
  BOOTSTRAP_MODE: Env.schema.boolean.optional(),
  DOTG_INSTALL_DIR: Env.schema.string.optional(),
  ACME_EMAIL: Env.schema.string.optional(),

  // Session
  SESSION_DRIVER: Env.schema.enum(['cookie', 'memory', 'database'] as const),

  // Database
  DB_CONNECTION: Env.schema.enum(['sqlite', 'libsql'] as const),
  DB_DATABASE: Env.schema.string.optional(),
  LIBSQL_URL: Env.schema.string.optional(),
  LIBSQL_AUTH_TOKEN: Env.schema.string.optional(),

  // Docker
  DOCKER_SOCKET: Env.schema.string.optional(),
  DOCKER_NETWORK: Env.schema.string.optional(),
  DOCKER_REGISTRY: Env.schema.string.optional(),
  ENV_IMAGE_PREFIX: Env.schema.string.optional(),
  ENV_CPU_LIMIT: Env.schema.number.optional(),
  ENV_MEMORY_LIMIT: Env.schema.string.optional(),
  ENV_WORKSPACE_PATH: Env.schema.string.optional(),

  // Bootstrap admin
  ADMIN_EMAIL: Env.schema.string.optional(),
  ADMIN_PASSWORD: Env.schema.string.optional(),
  ADMIN_FULL_NAME: Env.schema.string.optional(),
  BOOTSTRAP_ADMIN_EMAIL: Env.schema.string.optional(),
  BOOTSTRAP_ADMIN_PASSWORD: Env.schema.string.optional(),
})
