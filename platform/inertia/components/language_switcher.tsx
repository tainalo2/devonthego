import { Form } from '@adonisjs/inertia/react'
import { LOCALE_LABELS, useI18n } from '~/hooks/use_i18n'

export default function LanguageSwitcher() {
  const { locale, supportedLocales, t } = useI18n()

  return (
    <Form route="locale.update" className="language-switcher">
      <label htmlFor="locale-select" className="sr-only">
        {t('messages.common.language')}
      </label>
      <select name="locale" id="locale-select" defaultValue={locale} onChange={(e) => e.currentTarget.form?.requestSubmit()}>
        {supportedLocales.map((code) => (
          <option key={code} value={code}>
            {LOCALE_LABELS[code] ?? code}
          </option>
        ))}
      </select>
    </Form>
  )
}
