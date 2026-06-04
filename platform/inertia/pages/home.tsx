import PublicLayout from '~/layouts/public'
import { useI18n } from '~/hooks/use_i18n'

export default function Home() {
  const { t } = useI18n()

  return (
    <PublicLayout>
      <div className="hero">
        <h1>{t('messages.home.title')}</h1>
        <p>{t('messages.home.subtitle')}</p>
        <div className="hero-actions">
          <a href="/login" className="btn btn-primary">
            {t('messages.home.login')}
          </a>
          <a href="/signup" className="btn">
            {t('messages.home.signup')}
          </a>
        </div>
      </div>
    </PublicLayout>
  )
}
