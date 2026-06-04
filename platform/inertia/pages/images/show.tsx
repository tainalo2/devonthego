import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

type Template = {
  id: number
  name: string
  slug: string
  dockerImage: string
  description: string | null
  dockerfile: string | null
  isDefault: boolean
  isBuiltin: boolean
  buildStatus: string
  buildError: string | null
  buildLog: string | null
  lastBuiltAt: string | null
  createdAt: string
}

type Props = {
  template: Template
}

export default function ImagesShow({ template: initial }: Props) {
  const [template, setTemplate] = useState(initial)

  useEffect(() => {
    setTemplate(initial)
  }, [initial])

  useEffect(() => {
    if (template.buildStatus !== 'building') return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/images/${template.id}/build-status`)
        if (!res.ok) return
        const data = await res.json()
        setTemplate((prev) => ({ ...prev, ...data }))

        if (data.buildStatus !== 'building') {
          router.reload({ only: ['template'] })
        }
      } catch {
        // ignore polling errors
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [template.id, template.buildStatus])

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>{template.name}</h1>
            <p className="muted">
              <code>{template.dockerImage}</code>
            </p>
          </div>
          <div className="actions-row">
            <Link route="images.edit" routeParams={{ id: template.id }} className="btn">
              Modifier
            </Link>
            <Link route="images.index">Retour</Link>
          </div>
        </div>

        <div className="detail-grid">
          <section className="card">
            <h2>Statut du build</h2>
            <dl className="detail-list">
              <div>
                <dt>Statut</dt>
                <dd>
                  <span className={`badge badge-${template.buildStatus}`}>{template.buildStatus}</span>
                  {template.buildStatus === 'building' && (
                    <span className="muted small"> — actualisation auto…</span>
                  )}
                </dd>
              </div>
              {template.lastBuiltAt && (
                <div>
                  <dt>Dernier build</dt>
                  <dd>{template.lastBuiltAt}</dd>
                </div>
              )}
              {template.buildError && (
                <div>
                  <dt>Erreur</dt>
                  <dd className="text-error">{template.buildError}</dd>
                </div>
              )}
            </dl>

            <Form route="images.build" routeParams={{ id: template.id }}>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={template.buildStatus === 'building'}
              >
                {template.buildStatus === 'building' ? 'Build en cours…' : 'Lancer le build Docker'}
              </button>
            </Form>
          </section>

          <section className="card">
            <h2>Informations</h2>
            <dl className="detail-list">
              <div>
                <dt>Description</dt>
                <dd>{template.description ?? '—'}</dd>
              </div>
              <div>
                <dt>Template par défaut</dt>
                <dd>{template.isDefault ? 'Oui' : 'Non'}</dd>
              </div>
              <div>
                <dt>Intégré</dt>
                <dd>{template.isBuiltin ? 'Oui' : 'Non'}</dd>
              </div>
            </dl>
          </section>
        </div>

        {template.buildLog && (
          <section className="card">
            <h2>Journal de build</h2>
            <pre className="docker-logs">{template.buildLog}</pre>
          </section>
        )}

        {template.dockerfile && (
          <section className="card">
            <h2>Dockerfile</h2>
            <pre className="docker-logs">{template.dockerfile}</pre>
          </section>
        )}

        {!template.isBuiltin && (
          <Form route="images.destroy" routeParams={{ id: template.id }} className="danger-zone">
            <button type="submit" className="btn btn-danger">
              Supprimer le template
            </button>
          </Form>
        )}
      </div>
    </AppLayout>
  )
}
