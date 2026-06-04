import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { Form } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'
import ModulePicker from '~/components/module_picker'

export type EnvironmentModule = {
  id: number
  moduleKey: string
  displayName: string
  description: string | null
  source: string
  installType: string
  packageRef: string
  status: string
  errorMessage: string | null
  installedAt: string | null
}

type Props = {
  environmentId: number
  modules: EnvironmentModule[]
  canManage: boolean
  environmentStatus: string
}

export default function ModuleManager({
  environmentId,
  modules: initialModules,
  canManage,
  environmentStatus,
}: Props) {
  const { t, moduleStatusLabel } = useI18n()
  const [modules, setModules] = useState(initialModules)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => {
    setModules(initialModules)
  }, [initialModules])

  const isBusy = modules.some((module) =>
    ['pending', 'installing', 'removing'].includes(module.status)
  )

  useEffect(() => {
    if (!isBusy) {
      return
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/environments/${environmentId}/modules/status`)
        if (!res.ok) {
          return
        }

        const data = (await res.json()) as { modules: EnvironmentModule[] }
        setModules(data.modules)

        if (
          !data.modules.some((module) =>
            ['pending', 'installing', 'removing'].includes(module.status)
          )
        ) {
          router.reload({ only: ['modules', 'logs'] })
        }
      } catch {
        // ignore polling errors
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [environmentId, isBusy])

  return (
    <section className="card form-card">
      <h2>{t('messages.modules.title')}</h2>
      <p className="muted small">{t('messages.modules.manageHint')}</p>

      {modules.length === 0 ? (
        <p className="muted">{t('messages.modules.noneInstalled')}</p>
      ) : (
        <ul className="module-installed-list">
          {modules.map((module) => (
            <li key={module.id} className="module-installed-item">
              <div>
                <strong>{module.displayName}</strong>
                <span className="muted"> — {module.packageRef}</span>
                {module.description && <p className="muted small">{module.description}</p>}
                {module.errorMessage && <p className="text-error small">{module.errorMessage}</p>}
              </div>
              <div className="module-installed-actions">
                <span className={`badge badge-${module.status}`}>
                  {moduleStatusLabel(module.status)}
                </span>
                {canManage &&
                  module.status === 'installed' &&
                  environmentStatus === 'running' &&
                  !isBusy && (
                    <Form
                      route="environments.modules.destroy"
                      routeParams={{ id: environmentId, moduleId: module.id }}
                    >
                      <button type="submit" className="btn btn-small">
                        {t('messages.modules.remove')}
                      </button>
                    </Form>
                  )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {canManage && (
        <div className="module-manager-actions">
          {environmentStatus !== 'running' && (
            <p className="muted small">{t('messages.modules.startRequired')}</p>
          )}

          {!showPicker ? (
            <button
              type="button"
              className="btn"
              onClick={() => setShowPicker(true)}
              disabled={environmentStatus !== 'running' || isBusy}
            >
              {t('messages.modules.addModules')}
            </button>
          ) : (
            <Form
              route="environments.modules.store"
              routeParams={{ id: environmentId }}
              className="form module-add-panel"
              onSuccess={() => setShowPicker(false)}
            >
              <ModulePicker />
              <div className="actions-row">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={environmentStatus !== 'running' || isBusy}
                >
                  {t('messages.modules.installSelected')}
                </button>
                <button type="button" className="btn" onClick={() => setShowPicker(false)}>
                  {t('messages.common.cancel')}
                </button>
              </div>
            </Form>
          )}
        </div>
      )}
    </section>
  )
}
