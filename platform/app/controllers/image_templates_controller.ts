import db from '@adonisjs/lucid/services/db'
import ImageTemplate from '#models/image_template'
import ImageBuilderService from '#services/image_builder_service'
import {
  createImageTemplateValidator,
  updateImageTemplateValidator,
} from '#validators/image_template'
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
        buildStatus: template.buildStatus,
        buildError: template.buildError,
        buildLog: template.buildLog,
        lastBuiltAt: template.lastBuiltAt?.toISO() ?? null,
        createdAt: template.createdAt.toISO() ?? '',
      })),
    })
  }

  async create({ inertia }: HttpContext) {
    return inertia.render('images/create', {
      defaultDockerfile: ImageBuilderService.defaultDockerfile(),
    })
  }

  async store({ request, response, session, i18n }: HttpContext) {
    const payload = await request.validateUsing(createImageTemplateValidator)
    const slug = ImageBuilderService.slugFromName(payload.name)

    const template = await ImageTemplate.create({
      name: payload.name,
      slug,
      dockerImage: ImageBuilderService.dockerImageForSlug(slug),
      description: payload.description ?? null,
      dockerfile: payload.dockerfile ?? ImageBuilderService.defaultDockerfile(),
      isDefault: payload.isDefault ?? false,
      isBuiltin: false,
      buildStatus: 'idle',
    })

    if (template.isDefault) {
      await db.from('image_templates').whereNot('id', template.id).update({ is_default: false })
    }

    session.flash('success', i18n.t('flash.images.created', { name: template.name }))
    return response.redirect().toRoute('images.show', { id: template.id })
  }

  async show({ inertia, params }: HttpContext) {
    const template = await ImageTemplate.findOrFail(params.id)

    return inertia.render('images/show', {
      template: {
        id: template.id,
        name: template.name,
        slug: template.slug,
        dockerImage: template.dockerImage,
        description: template.description,
        dockerfile: template.dockerfile,
        isDefault: template.isDefault,
        isBuiltin: template.isBuiltin,
        buildStatus: template.buildStatus,
        buildError: template.buildError,
        buildLog: template.buildLog,
        lastBuiltAt: template.lastBuiltAt?.toISO() ?? null,
        createdAt: template.createdAt.toISO() ?? '',
      },
    })
  }

  async edit({ inertia, params }: HttpContext) {
    const template = await ImageTemplate.findOrFail(params.id)

    return inertia.render('images/edit', {
      template: {
        id: template.id,
        name: template.name,
        slug: template.slug,
        description: template.description,
        dockerfile: template.dockerfile ?? ImageBuilderService.defaultDockerfile(),
        isDefault: template.isDefault,
        isBuiltin: template.isBuiltin,
      },
    })
  }

  async update({ request, response, params, session, i18n }: HttpContext) {
    const template = await ImageTemplate.findOrFail(params.id)
    const payload = await request.validateUsing(updateImageTemplateValidator)

    template.merge({
      name: payload.name ?? template.name,
      description: payload.description ?? template.description,
      dockerfile: payload.dockerfile ?? template.dockerfile,
      isDefault: payload.isDefault ?? template.isDefault,
    })
    await template.save()

    if (template.isDefault) {
      await db.from('image_templates').whereNot('id', template.id).update({ is_default: false })
    }

    session.flash('success', i18n.t('flash.images.updated'))
    return response.redirect().toRoute('images.show', { id: template.id })
  }

  async build({ response, params, session, i18n }: HttpContext) {
    const template = await ImageTemplate.findOrFail(params.id)

    if (template.buildStatus === 'building') {
      session.flash('error', i18n.t('flash.images.build_in_progress'))
      return response.redirect().toRoute('images.show', { id: template.id })
    }

    const builder = new ImageBuilderService()
    builder.startBuildAsync(template.id)

    session.flash('success', i18n.t('flash.images.build_started', { name: template.name }))
    return response.redirect().toRoute('images.show', { id: template.id })
  }

  async buildStatus({ params, response }: HttpContext) {
    const template = await ImageTemplate.findOrFail(params.id)

    return response.json({
      id: template.id,
      buildStatus: template.buildStatus,
      buildError: template.buildError,
      buildLog: template.buildLog,
      lastBuiltAt: template.lastBuiltAt?.toISO() ?? null,
    })
  }

  async destroy({ response, params, session, i18n }: HttpContext) {
    const template = await ImageTemplate.findOrFail(params.id)

    if (template.isBuiltin) {
      session.flash('error', i18n.t('flash.images.builtin_delete_denied'))
      return response.redirect().toRoute('images.index')
    }

    await template.delete()
    session.flash('success', i18n.t('flash.images.deleted'))
    return response.redirect().toRoute('images.index')
  }
}
