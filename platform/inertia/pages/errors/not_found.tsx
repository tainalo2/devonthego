import { useI18n } from '~/hooks/use_i18n'

export default function NotFound() {
  const { t } = useI18n()

  return (
    <>
      <h1>{t('messages.errorsPage.notFound')}</h1>
    </>
  )
}
