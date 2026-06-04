import i18nManager from '@adonisjs/i18n/services/main'
import type { HttpContext } from '@adonisjs/core/http'

const LOCALE_SESSION_KEY = 'locale'

export default class LocaleController {
  async update({ request, session, response }: HttpContext) {
    const locale = request.input('locale') as string
    const supported = i18nManager.supportedLocales()

    if (!locale || !supported.includes(locale)) {
      return response.redirect().back()
    }

    session.put(LOCALE_SESSION_KEY, locale)
    return response.redirect().back()
  }
}
