import vine from '@vinejs/vine'

export const setupValidator = vine.compile(
  vine.object({
    domain: vine
      .string()
      .trim()
      .regex(/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/i),
    acmeEmail: vine.string().trim().email(),
    adminEmail: vine.string().trim().email(),
    adminFullName: vine.string().trim().minLength(2).maxLength(100),
    adminPassword: vine.string().minLength(8).maxLength(128),
    adminPasswordConfirmation: vine.string().confirmed({ confirmationField: 'adminPassword' }),
    allowPublicSignup: vine.any().transform((value) => {
      if (Array.isArray(value)) {
        return value.includes('1') || value.includes(1) || value.includes(true)
      }
      return value === true || value === 'true' || value === '1' || value === 1
    }),
    envCpuLimit: vine.number().min(0.25).max(32),
    envMemoryLimit: vine.string().trim().regex(/^\d+[mMgG]?$/),
  })
)
