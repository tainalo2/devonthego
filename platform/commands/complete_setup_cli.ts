import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import i18nManager from '@adonisjs/i18n/services/main'
import SetupService from '#services/setup_service'

export default class CompleteSetupCli extends BaseCommand {
  static commandName = 'dotg:complete-setup-cli'
  static description =
    'Finalise la configuration initiale depuis le .env (chemin CLI / install.sh --configure-cli)'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    const t = i18nManager.locale('en').t.bind(i18nManager.locale('en'))

    if (await SetupService.isCompleted()) {
      this.logger.warning(t('messages.cli.setupAlreadyComplete'))
      return
    }

    const { appUrl } = await SetupService.completeSetupFromEnvFile()
    this.logger.success(t('messages.cli.setupSaved', { url: appUrl }))
    this.logger.info(t('messages.cli.setupRestartHint'))
  }
}
