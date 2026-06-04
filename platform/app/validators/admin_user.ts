import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    fullName: vine.string().trim().maxLength(120).optional(),
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(8).maxLength(64),
    role: vine.enum(['admin', 'user']),
    isActive: vine.boolean().optional(),
  })
)

export const updateUserValidator = vine.withMetaData<{ userId: number }>().compile(
  vine.object({
    fullName: vine.string().trim().maxLength(120).optional(),
    email: vine
      .string()
      .email()
      .normalizeEmail()
      .unique(async (db, value, field) => {
        const user = await db.from('users').where('email', value).whereNot('id', field.meta.userId).first()
        return !user
      }),
    password: vine.string().minLength(8).maxLength(64).optional(),
    role: vine.enum(['admin', 'user']),
    isActive: vine.boolean(),
  })
)
