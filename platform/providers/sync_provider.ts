import type { ApplicationService } from '@adonisjs/core/types'
import Environment from '#models/environment'
import EnvironmentService from '#services/environment_service'

export default class SyncProvider {
  #timer: NodeJS.Timeout | null = null

  constructor(protected app: ApplicationService) {}

  register() {}

  async boot() {
    if (process.env.NODE_ENV !== 'production') {
      return
    }

    const intervalMs = 60_000

    this.#timer = setInterval(async () => {
      try {
        const service = new EnvironmentService()
        const environments = await Environment.query().whereIn('status', ['running', 'stopped', 'creating'])

        for (const environment of environments) {
          await service.syncStatus(environment)
        }
      } catch {
        // sync silencieux — ne pas crasher l'app
      }
    }, intervalMs)

    this.#timer.unref()
  }

  async shutdown() {
    if (this.#timer) {
      clearInterval(this.#timer)
    }
  }
}
