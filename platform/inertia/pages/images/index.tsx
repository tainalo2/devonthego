import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type Template = {
  id: number
  name: string
  slug: string
  dockerImage: string
  description: string | null
  isDefault: boolean
  isBuiltin: boolean
  buildStatus: string
  buildError: string | null
  lastBuiltAt: string | null
  createdAt: string
}

type Props = {
  templates: Template[]
}

export default function ImagesIndex({ templates }: Props) {
  const { t, buildStatusLabel, templateDescription } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.images.title')}</h1>
          <Link route="images.create" className="btn btn-primary">
            {t('messages.images.new')}
          </Link>
        </div>

        <section className="card">
          <p className="muted">{t('messages.images.registryHint')}</p>
          <table className="table">
            <thead>
              <tr>
                <th>{t('messages.images.columns.name')}</th>
                <th>{t('messages.images.columns.dockerImage')}</th>
                <th>{t('messages.images.columns.build')}</th>
                <th>{t('messages.images.columns.default')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>
                    {template.name}
                    {template.isBuiltin && (
                      <span className="badge badge-user">{t('messages.common.builtin')}</span>
                    )}
                    {template.isBuiltin && (
                      <p className="muted small">
                        {templateDescription(template.slug, template.description)}
                      </p>
                    )}
                  </td>
                  <td>
                    <code>{template.dockerImage}</code>
                  </td>
                  <td>
                    <span
                      className={`badge badge-${template.buildStatus === 'success' ? 'running' : template.buildStatus}`}
                    >
                      {buildStatusLabel(template.buildStatus)}
                    </span>
                    {template.buildError && (
                      <p className="text-error small">{template.buildError}</p>
                    )}
                  </td>
                  <td>
                    {template.isDefault ? t('messages.common.yes') : t('messages.common.no')}
                  </td>
                  <td>
                    <Link route="images.show" routeParams={{ id: template.id }}>
                      {t('messages.common.details')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppLayout>
  )
}
