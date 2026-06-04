import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import Environment from '#models/environment'
import EnvironmentService from '#services/environment_service'

export default class SyncEnvironments extends BaseCommand {
  static commandName = 'dotg:sync-environments'
  static description = 'Synchronise le statut de tous les environnements avec Docker'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const service = new EnvironmentService()
    const environments = await Environment.query().whereNot('status', 'deleting')

    let updated = 0
    for (const environment of environments) {
      const before = environment.status
      await service.syncStatus(environment)
      if (before !== environment.status) {
        updated++
        this.logger.info(`${environment.slug}: ${before} → ${environment.status}`)
      }
    }

    this.logger.success(`Sync terminée — ${environments.length} env(s), ${updated} mis à jour`)
  }
}
