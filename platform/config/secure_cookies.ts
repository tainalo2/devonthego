import env from '#start/env'
import app from '@adonisjs/core/services/app'

/**
 * Cookies sécurisés dès que APP_URL est en HTTPS (bootstrap autosigné ou production).
 */
export function useSecureCookies(): boolean {
  if (!app.inProduction) {
    return false
  }
  return env.get('APP_URL', 'http://localhost').startsWith('https://')
}
