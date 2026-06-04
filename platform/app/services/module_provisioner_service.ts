import { DateTime } from 'luxon'
import Environment from '#models/environment'
import EnvironmentLog from '#models/environment_log'
import EnvironmentModule from '#models/environment_module'
import DockerService from '#services/docker_service'
import ModuleCatalogService, { type ResolvedModule } from '#services/module_catalog_service'

export default class ModuleProvisionerService {
  constructor(
    protected docker = new DockerService(),
    protected catalog = new ModuleCatalogService()
  ) {}

  async installMany(environment: Environment, moduleKeys: string[]): Promise<EnvironmentModule[]> {
    const uniqueKeys = [...new Set(moduleKeys)]
    const installed: EnvironmentModule[] = []

    for (const moduleKey of uniqueKeys) {
      try {
        const record = await this.install(environment, moduleKey)
        if (record) {
          installed.push(record)
        }
      } catch {
        // Failure is recorded on the module row and in environment logs.
      }
    }

    return installed
  }

  async install(environment: Environment, moduleKey: string): Promise<EnvironmentModule | null> {
    const resolved = this.catalog.resolveModuleKey(moduleKey)
    if (!resolved) {
      throw new Error(`Invalid module key: ${moduleKey}`)
    }

    const existing = await EnvironmentModule.query()
      .where('environment_id', environment.id)
      .where('module_key', resolved.key)
      .first()

    if (existing && ['installed', 'installing', 'pending'].includes(existing.status)) {
      return existing
    }

    const record =
      existing ??
      (await EnvironmentModule.create({
        environmentId: environment.id,
        moduleKey: resolved.key,
        displayName: resolved.displayName,
        description: resolved.description,
        source: resolved.source,
        installType: resolved.installType,
        packageRef: resolved.packageRef,
        status: 'pending',
      }))

    await this.#ensureContainerRunning(environment)
    await this.#runInstall(environment, record, resolved)

    return record
  }

  async uninstall(environment: Environment, moduleRecord: EnvironmentModule): Promise<void> {
    if (moduleRecord.status === 'removing') {
      return
    }

    await this.#ensureContainerRunning(environment)

    moduleRecord.status = 'removing'
    moduleRecord.errorMessage = null
    await moduleRecord.save()

    const resolved = this.catalog.resolveModuleKey(moduleRecord.moduleKey)
    if (!resolved) {
      moduleRecord.status = 'failed'
      moduleRecord.errorMessage = 'Module definition not found'
      await moduleRecord.save()
      throw new Error(moduleRecord.errorMessage)
    }

    try {
      const result = await this.docker.exec(
        environment.containerId!,
        ['bash', '-lc', this.#buildRemoveCommand(resolved)],
        'root'
      )

      if (result.exitCode !== 0) {
        throw new Error(this.#formatExecError(result))
      }

      await moduleRecord.delete()
      await this.#log(
        environment.id,
        'info',
        `Module removed: ${moduleRecord.displayName} (${moduleRecord.packageRef})`
      )
    } catch (error) {
      moduleRecord.status = 'failed'
      moduleRecord.errorMessage = error instanceof Error ? error.message : String(error)
      await moduleRecord.save()
      await this.#log(environment.id, 'error', moduleRecord.errorMessage)
      throw error
    }
  }

  async #runInstall(
    environment: Environment,
    record: EnvironmentModule,
    resolved: ResolvedModule
  ): Promise<void> {
    record.status = 'installing'
    record.errorMessage = null
    await record.save()

    await this.#log(
      environment.id,
      'info',
      `Installing module: ${record.displayName} (${record.packageRef})`
    )

    try {
      const result = await this.docker.exec(
        environment.containerId!,
        ['bash', '-lc', this.#buildInstallCommand(resolved)],
        'root'
      )

      if (result.exitCode !== 0) {
        throw new Error(this.#formatExecError(result))
      }

      record.status = 'installed'
      record.installedAt = DateTime.utc()
      record.errorMessage = null
      await record.save()

      await this.#log(
        environment.id,
        'info',
        `Module installed: ${record.displayName} (${record.packageRef})`
      )
    } catch (error) {
      record.status = 'failed'
      record.errorMessage = error instanceof Error ? error.message : String(error)
      await record.save()
      await this.#log(environment.id, 'error', record.errorMessage)
      throw error
    }
  }

  async #ensureContainerRunning(environment: Environment): Promise<void> {
    if (!environment.containerId) {
      throw new Error('Environment container is not running. Start the environment first.')
    }

    const info = await this.docker.inspectContainer(environment.containerId)
    if (!info.State.Running) {
      throw new Error('Environment container is stopped. Start the environment first.')
    }
  }

  #buildInstallCommand(resolved: ResolvedModule): string {
    if (resolved.installType === 'script' && resolved.installScript) {
      return resolved.installScript
    }

    if (resolved.installType === 'npm') {
      return `npm install -g ${resolved.packageRef}`
    }

    return [
      'set -e',
      'export DEBIAN_FRONTEND=noninteractive',
      'apt-get update -qq',
      `apt-get install -y --no-install-recommends ${resolved.packageRef}`,
    ].join(' && ')
  }

  #buildRemoveCommand(resolved: ResolvedModule): string {
    if (resolved.installType === 'script' && resolved.removeScript) {
      return resolved.removeScript
    }

    if (resolved.installType === 'npm') {
      return `npm uninstall -g ${resolved.packageRef}`
    }

    return [
      'set -e',
      'export DEBIAN_FRONTEND=noninteractive',
      `apt-get remove -y ${resolved.packageRef}`,
    ].join(' && ')
  }

  #formatExecError(result: { stdout: string; stderr: string; exitCode: number }): string {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    return output || `Command failed with exit code ${result.exitCode}`
  }

  async #log(environmentId: number, level: 'info' | 'warn' | 'error', message: string) {
    await EnvironmentLog.create({ environmentId, level, message })
  }
}
