import vine from '@vinejs/vine'

const moduleKeyRule = vine
  .string()
  .trim()
  .regex(/^(curated|debian):[a-z0-9.+_-]+$/)

export const installEnvironmentModulesValidator = vine.compile(
  vine.object({
    moduleKeys: vine.array(moduleKeyRule).minLength(1).maxLength(20),
  })
)

export const searchModulesValidator = vine.compile(
  vine.object({
    q: vine.string().trim().minLength(2).maxLength(80),
  })
)
