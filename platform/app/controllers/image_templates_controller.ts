import ImageTemplate from '#models/image_template'
import type { HttpContext } from '@adonisjs/core/http'

export default class ImageTemplatesController {
  async index({ inertia }: HttpContext) {
    const templates = await ImageTemplate.query().orderBy('name')

    return inertia.render('images/index', {
      templates: templates.map((template) => ({
        id: template.id,
        name: template.name,
        slug: template.slug,
        dockerImage: template.dockerImage,
        description: template.description,
        isDefault: template.isDefault,
        isBuiltin: template.isBuiltin,
        createdAt: template.createdAt.toISO() ?? '',
      })),
    })
  }
}
