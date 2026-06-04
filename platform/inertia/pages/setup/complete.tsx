import { useI18n } from '~/hooks/use_i18n'

type Props = {
  appUrl: string
}

export default function SetupComplete({ appUrl }: Props) {
  const { t } = useI18n()

  return (
    <div className="setup-page">
      <div className="setup-container">
        <section className="card">
          <h1>{t('messages.setup.complete.title')}</h1>
          <p>{t('messages.setup.complete.description')}</p>
          <p>
            {t('messages.setup.complete.reconnect')}{' '}
            <a href={appUrl} className="btn btn-primary">
              {appUrl}
            </a>
          </p>
          <ul className="setup-checklist">
            <li>{t('messages.setup.complete.useAdminCredentials')}</li>
            <li>{t('messages.setup.complete.letsEncryptWait')}</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
