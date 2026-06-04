import { useI18n } from '~/hooks/use_i18n'

export default function ServerError() {
  const { t } = useI18n()

  return (
    <>
      <h1>{t('messages.errorsPage.serverError')}</h1>
    </>
  )
}
