import vine from '@vinejs/vine'

export const createImageTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(80),
    description: vine.string().trim().maxLength(500).optional(),
    dockerfile: vine.string().trim().minLength(10).optional(),
    isDefault: vine.boolean().optional(),
  })
)

export const updateImageTemplateValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(2).maxLength(80).optional(),
    description: vine.string().trim().maxLength(500).optional(),
    dockerfile: vine.string().trim().minLength(10).optional(),
    isDefault: vine.boolean().optional(),
  })
)
