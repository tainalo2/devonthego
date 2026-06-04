import { randomBytes } from 'node:crypto'
// @ts-expect-error Package without TypeScript definitions
import apacheCrypt from 'apache-crypt'

export default class TraefikAuthService {
  /**
   * Génère un hash compatible Traefik basic auth (format htpasswd apr1).
   */
  static hashPassword(username: string, password: string): string {
    const salt = randomBytes(4).toString('hex').slice(0, 8)
    const hash = apacheCrypt(password, `$apr1$${salt}$`)
    return `${username}:${hash}`
  }

  /**
   * Échappe les $ pour les labels Docker Compose / Traefik.
   */
  static escapeForDockerLabel(value: string): string {
    return value.replace(/\$/g, '$$')
  }
}
