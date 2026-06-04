import PlatformSetting from '#models/platform_setting'
import User from '#models/user'
import env from '#start/env'
import { spawn } from 'node:child_process'
import { readFile, writeFile } from 'node:fs/promises'
import { DateTime } from 'luxon'

export type SetupPayload = {
  domain: string
  acmeEmail: string
  adminEmail: string
  adminFullName: string
  adminPassword: string
  allowPublicSignup: boolean
  envCpuLimit: number
  envMemoryLimit: string
}

export default class SetupService {
  static async isCompleted(): Promise<boolean> {
    if (!env.get('BOOTSTRAP_MODE', false)) {
      return true
    }

    const settings = await PlatformSetting.getSingleton()
    return settings.setupCompleted
  }

  static installDir(): string {
    return env.get('DOTG_INSTALL_DIR', '/install')
  }

  static escapeEnvValue(value: string): string {
    if (/[\s#"$\\']/.test(value)) {
      const escaped = value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
      return `"${escaped}"`
    }
    return value
  }

  static async readEnvFile(): Promise<Map<string, string>> {
    const installDir = this.installDir()
    const envPath = `${installDir}/.env`
    const values = new Map<string, string>()

    try {
      const content = await readFile(envPath, 'utf-8')
      for (const line of content.split('\n')) {
        const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
        if (!match) continue
        let value = match[2]
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1)
        }
        values.set(match[1], value)
      }
    } catch {
      // fichier absent — valeurs vides
    }

    return values
  }

  static async writeEnvFile(updates: Record<string, string>): Promise<void> {
    const installDir = this.installDir()
    const examplePath = `${installDir}/.env.example`
    const envPath = `${installDir}/.env`

    const template = await readFile(examplePath, 'utf-8')
    const updateKeys = new Set(Object.keys(updates))

    const lines = template.split('\n').map((line) => {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/)
      if (match && updateKeys.has(match[1])) {
        return `${match[1]}=${this.escapeEnvValue(updates[match[1]]!)}`
      }
      return line
    })

    const writtenKeys = new Set<string>()
    for (const line of lines) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=/)
      if (match) writtenKeys.add(match[1])
    }

    for (const [key, value] of Object.entries(updates)) {
      if (!writtenKeys.has(key)) {
        lines.push(`${key}=${this.escapeEnvValue(value)}`)
      }
    }

    await writeFile(envPath, `${lines.join('\n').trimEnd()}\n`, { mode: 0o600 })
  }

  static async completeSetup(payload: SetupPayload, adminUser: User): Promise<{ appUrl: string }> {
    const appKey = env.get('APP_KEY').release()
    const appUrl = `https://admin.${payload.domain}`

    const envUpdates: Record<string, string> = {
      BOOTSTRAP_MODE: 'false',
      DOMAIN: payload.domain,
      ACME_EMAIL: payload.acmeEmail,
      ADMIN_EMAIL: payload.adminEmail,
      ADMIN_FULL_NAME: payload.adminFullName,
      ADMIN_PASSWORD: payload.adminPassword,
      APP_KEY: appKey,
      APP_URL: appUrl,
      ALLOW_PUBLIC_SIGNUP: payload.allowPublicSignup ? 'true' : 'false',
      ENV_CPU_LIMIT: String(payload.envCpuLimit),
      ENV_MEMORY_LIMIT: payload.envMemoryLimit,
      DOTG_INSTALL_DIR: this.installDir(),
    }

    adminUser.merge({
      email: payload.adminEmail,
      fullName: payload.adminFullName,
      password: payload.adminPassword,
    })
    await adminUser.save()

    await this.writeEnvFile(envUpdates)

    const settings = await PlatformSetting.getSingleton()
    settings.setupCompleted = true
    settings.setupCompletedAt = DateTime.now()
    await settings.save()

    this.scheduleProductionDeploy()

    return { appUrl }
  }

  static scheduleProductionDeploy(): void {
    const installDir = this.installDir()
    const script = `${installDir}/scripts/finish-setup.sh`

    setTimeout(() => {
      const child = spawn('sh', [script, installDir], {
        detached: true,
        stdio: 'ignore',
      })
      child.unref()
    }, 3000)
  }
}
