import Environment from '#models/environment'
import EnvironmentModule from '#models/environment_module'
import ModuleCatalogService from '#services/module_catalog_service'
import ModuleProvisionerService from '#services/module_provisioner_service'
import { installEnvironmentModulesValidator, searchModulesValidator } from '#validators/environment_module'
import type { HttpContext } from '@adonisjs/core/http'

export default class EnvironmentModulesController {
  async search({ request, response }: HttpContext) {
    const { q } = await request.validateUsing(searchModulesValidator)
    const catalog = new ModuleCatalogService()
    const results = await catalog.search(q)

    return response.json(results)
  }

  async curated({ response }: HttpContext) {
    const catalog = new ModuleCatalogService()
    return response.json({ curated: catalog.listCurated() })
  }

  async status({ params, auth, response }: HttpContext) {
    const user = auth.user!
    const environment = await this.#loadEnvironment(params.id, user)

    const modules = await EnvironmentModule.query()
      .where('environment_id', environment.id)
      .orderBy('display_name')

    return response.json({
      modules: modules.map((module) => this.#serializeModule(module)),
    })
  }

  async store({ params, request, response, auth, session, i18n }: HttpContext) {
    const user = auth.user!
    const environment = await this.#loadEnvironment(params.id, user, true)
    const payload = await request.validateUsing(installEnvironmentModulesValidator)
    const provisioner = new ModuleProvisionerService()

    try {
      await provisioner.installMany(environment, payload.moduleKeys)
      session.flash('success', i18n.t('flash.modules.installed'))
    } catch (error) {
      session.flash(
        'error',
        error instanceof Error ? error.message : i18n.t('flash.modules.install_failed')
      )
    }

    return response.redirect().toRoute('environments.show', { id: environment.id })
  }

  async destroy({ params, response, auth, session, i18n }: HttpContext) {
    const user = auth.user!
    const environment = await this.#loadEnvironment(params.id, user, true)
    const moduleRecord = await EnvironmentModule.query()
      .where('environment_id', environment.id)
      .where('id', params.moduleId)
      .firstOrFail()

    const provisioner = new ModuleProvisionerService()

    try {
      await provisioner.uninstall(environment, moduleRecord)
      session.flash('success', i18n.t('flash.modules.removed'))
    } catch (error) {
      session.flash(
        'error',
        error instanceof Error ? error.message : i18n.t('flash.modules.remove_failed')
      )
    }

    return response.redirect().toRoute('environments.show', { id: environment.id })
  }

  async #loadEnvironment(
    id: string,
    user: { id: number; isAdmin: boolean },
    requireManage = false
  ) {
    const environment = await Environment.query()
      .where('id', id)
      .preload('assignedUsers')
      .firstOrFail()

    const isOwner = environment.ownerId === user.id
    const isAssigned = environment.assignedUsers.some((assigned) => assigned.id === user.id)
    const canAccess = user.isAdmin || isOwner || isAssigned

    if (!canAccess) {
      throw new Error('Permission denied')
    }

    if (requireManage && !canAccess) {
      throw new Error('Permission denied')
    }

    return environment
  }

  #serializeModule(module: EnvironmentModule) {
    return {
      id: module.id,
      moduleKey: module.moduleKey,
      displayName: module.displayName,
      description: module.description,
      source: module.source,
      installType: module.installType,
      packageRef: module.packageRef,
      status: module.status,
      errorMessage: module.errorMessage,
      installedAt: module.installedAt?.toISO() ?? null,
    }
  }
}
