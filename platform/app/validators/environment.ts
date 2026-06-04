import vine from '@vinejs/vine'

export const createEnvironmentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(80),
    imageTemplateId: vine.number().optional(),
    ownerId: vine.number().optional(),
    cpuLimit: vine.number().min(1).max(8).optional(),
    memoryLimitMb: vine.number().min(256).max(16384).optional(),
    assignedUserIds: vine.array(vine.number()).optional(),
  })
)

export const assignEnvironmentUsersValidator = vine.compile(
  vine.object({
    assignedUserIds: vine.array(vine.number()).optional(),
  })
)

export const updateEnvironmentValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(80).optional(),
    assignedUserIds: vine.array(vine.number()).optional(),
  })
)
