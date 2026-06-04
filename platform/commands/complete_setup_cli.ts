import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import SetupService from '#services/setup_service'

export default class CompleteSetupCli extends BaseCommand {
  static commandName = 'dotg:complete-setup-cli'
  static description =
    'Finalise la configuration initiale depuis le .env (chemin CLI / install.sh --configure-cli)'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    if (await SetupService.isCompleted()) {
      this.logger.warning('La configuration initiale est déjà terminée.')
      return
    }

    const { appUrl } = await SetupService.completeSetupFromEnvFile()
    this.logger.success(`Configuration enregistrée — URL admin : ${appUrl}`)
    this.logger.info('Relancez la stack production via scripts/finish-setup.sh')
  }
}
