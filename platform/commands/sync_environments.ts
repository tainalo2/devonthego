import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import i18nManager from '@adonisjs/i18n/services/main'
import Environment from '#models/environment'
import EnvironmentService from '#services/environment_service'

export default class SyncEnvironments extends BaseCommand {
  static commandName = 'dotg:sync-environments'
  static description = 'Synchronise le statut de tous les environnements avec Docker'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const t = i18nManager.locale('en').t.bind(i18nManager.locale('en'))
    const service = new EnvironmentService()
    const environments = await Environment.query().whereNot('status', 'deleting')

    let updated = 0
    for (const environment of environments) {
      const before = environment.status
      await service.syncStatus(environment)
      if (before !== environment.status) {
        updated++
        this.logger.info(
          t('messages.cli.syncStatusChange', {
            slug: environment.slug,
            before,
            after: environment.status,
          })
        )
      }
    }

    this.logger.success(
      t('messages.cli.syncComplete', { total: environments.length, updated })
    )
  }
}
