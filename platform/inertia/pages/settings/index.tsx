import AppLayout from '~/layouts/app'
import { useI18n } from '~/hooks/use_i18n'

type Settings = {
  domain: string
  dockerNetwork: string
  dockerRegistry: string
  workspacePath: string
  defaultCpuLimit: number
  defaultMemoryLimit: string
  allowPublicSignup: boolean
  dbConnection: string
  appUrl: string
}

type Props = {
  settings: Settings
}

export default function SettingsIndex({ settings }: Props) {
  const { t } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.settings.title')}</h1>
        </div>

        <section className="card">
          <p className="muted">{t('messages.settings.envHint')}</p>

          <dl className="detail-list settings-list">
            <div>
              <dt>{t('messages.settings.domain')}</dt>
              <dd>{settings.domain}</dd>
            </div>
            <div>
              <dt>{t('messages.settings.adminUrl')}</dt>
              <dd>{settings.appUrl}</dd>
            </div>
            <div>
              <dt>{t('messages.settings.dockerNetwork')}</dt>
              <dd>{settings.dockerNetwork}</dd>
            </div>
            <div>
              <dt>{t('messages.settings.localRegistry')}</dt>
              <dd>{settings.dockerRegistry}</dd>
            </div>
            <div>
              <dt>{t('messages.settings.workspacePath')}</dt>
              <dd>{settings.workspacePath}</dd>
            </div>
            <div>
              <dt>{t('messages.settings.defaultCpu')}</dt>
              <dd>{t('messages.settings.cores', { count: settings.defaultCpuLimit })}</dd>
            </div>
            <div>
              <dt>{t('messages.settings.defaultRam')}</dt>
              <dd>{settings.defaultMemoryLimit}</dd>
            </div>
            <div>
              <dt>{t('messages.settings.database')}</dt>
              <dd>{settings.dbConnection}</dd>
            </div>
            <div>
              <dt>{t('messages.settings.publicSignup')}</dt>
              <dd>
                {settings.allowPublicSignup
                  ? t('messages.settings.publicSignupEnabled')
                  : t('messages.settings.publicSignupDisabled')}
              </dd>
            </div>
          </dl>
        </section>

        <section className="card">
          <h2>{t('messages.settings.maintenance')}</h2>
          <p className="muted">{t('messages.settings.cronHint')}</p>
          <pre className="docker-logs">node ace dotg:sync-environments</pre>
        </section>
      </div>
    </AppLayout>
  )
}
