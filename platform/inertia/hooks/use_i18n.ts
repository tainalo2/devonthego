import { usePage } from '@inertiajs/react'
import type { Data } from '@generated/data'

type I18nProps = {
  locale: string
  translations: Record<string, string>
  supportedLocales: string[]
}

function interpolate(message: string, data?: Record<string, string | number>): string {
  if (!data) return message
  return Object.entries(data).reduce(
    (result, [key, value]) => result.replace(new RegExp(`\\{${key}\\}`, 'g'), String(value)),
    message
  )
}

export function useI18n() {
  const { locale, translations, supportedLocales } = usePage<Data.SharedProps & I18nProps>().props

  function t(key: string, data?: Record<string, string | number>, fallback?: string): string {
    const message = translations[key] ?? fallback ?? key
    return interpolate(message, data)
  }

  function statusLabel(status: string): string {
    return t(`messages.status.${status}`, undefined, status)
  }

  function buildStatusLabel(status: string): string {
    return t(`messages.buildStatus.${status}`, undefined, status)
  }

  function roleLabel(role: string): string {
    return t(`messages.roles.${role}`, undefined, role)
  }

  function webhookEventLabel(event: string): string {
    return t(`messages.webhookEvents.${event}`, undefined, event)
  }

  function templateDescription(slug: string, fallback?: string | null): string {
    return t(`messages.seeder.templates.${slug}.description`, undefined, fallback ?? slug)
  }

  function moduleStatusLabel(status: string): string {
    return t(`messages.status.${status}`, undefined, status)
  }

  return {
    t,
    locale,
    supportedLocales,
    statusLabel,
    buildStatusLabel,
    roleLabel,
    webhookEventLabel,
    templateDescription,
    moduleStatusLabel,
  }
}

export const LOCALE_LABELS: Record<string, string> = {
  en: 'English',
  fr: 'Français',
  es: 'Español',
  de: 'Deutsch',
  pt: 'Português',
  it: 'Italiano',
}
