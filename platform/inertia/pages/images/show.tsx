import { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

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
  const { t, buildStatusLabel, templateDescription } = useI18n()
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

  const description =
    template.isBuiltin && template.slug
      ? templateDescription(template.slug, template.description)
      : (template.description ?? '—')

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
              {t('messages.common.edit')}
            </Link>
            <Link route="images.index">{t('messages.common.back')}</Link>
          </div>
        </div>

        <div className="detail-grid">
          <section className="card">
            <h2>{t('messages.images.show.buildStatus')}</h2>
            <dl className="detail-list">
              <div>
                <dt>{t('messages.common.status')}</dt>
                <dd>
                  <span className={`badge badge-${template.buildStatus}`}>
                    {buildStatusLabel(template.buildStatus)}
                  </span>
                  {template.buildStatus === 'building' && (
                    <span className="muted small">{t('messages.images.show.autoRefresh')}</span>
                  )}
                </dd>
              </div>
              {template.lastBuiltAt && (
                <div>
                  <dt>{t('messages.images.show.lastBuild')}</dt>
                  <dd>{template.lastBuiltAt}</dd>
                </div>
              )}
              {template.buildError && (
                <div>
                  <dt>{t('messages.common.error')}</dt>
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
                {template.buildStatus === 'building'
                  ? t('messages.images.show.buildInProgress')
                  : t('messages.images.show.startBuild')}
              </button>
            </Form>
          </section>

          <section className="card">
            <h2>{t('messages.images.show.info')}</h2>
            <dl className="detail-list">
              <div>
                <dt>{t('messages.images.templateDescription')}</dt>
                <dd>{description}</dd>
              </div>
              <div>
                <dt>{t('messages.images.show.defaultTemplate')}</dt>
                <dd>{template.isDefault ? t('messages.common.yes') : t('messages.common.no')}</dd>
              </div>
              <div>
                <dt>{t('messages.images.show.builtin')}</dt>
                <dd>{template.isBuiltin ? t('messages.common.yes') : t('messages.common.no')}</dd>
              </div>
            </dl>
          </section>
        </div>

        {template.buildLog && (
          <section className="card">
            <h2>{t('messages.images.show.buildLog')}</h2>
            <pre className="docker-logs">{template.buildLog}</pre>
          </section>
        )}

        {template.dockerfile && (
          <section className="card">
            <h2>{t('messages.images.show.dockerfile')}</h2>
            <pre className="docker-logs">{template.dockerfile}</pre>
          </section>
        )}

        {!template.isBuiltin && (
          <Form route="images.destroy" routeParams={{ id: template.id }} className="danger-zone">
            <button type="submit" className="btn btn-danger">
              {t('messages.images.form.deleteTemplate')}
            </button>
          </Form>
        )}
      </div>
    </AppLayout>
  )
}
