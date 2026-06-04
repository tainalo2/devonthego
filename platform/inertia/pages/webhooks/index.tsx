import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type WebhookItem = {
  id: number
  name: string
  url: string
  events: string[]
  isActive: boolean
  createdAt: string
}

type Props = {
  webhooks: WebhookItem[]
  availableEvents: string[]
}

export default function WebhooksIndex({ webhooks }: Props) {
  const { t } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.webhooks.title')}</h1>
          <Link route="webhooks.create" className="btn btn-primary">
            {t('messages.webhooks.new')}
          </Link>
        </div>

        <section className="card">
          <p className="muted">{t('messages.webhooks.hint')}</p>
          {webhooks.length === 0 ? (
            <p className="muted">{t('messages.webhooks.none')}</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>{t('messages.webhooks.columns.name')}</th>
                  <th>{t('messages.webhooks.columns.url')}</th>
                  <th>{t('messages.webhooks.columns.events')}</th>
                  <th>{t('messages.webhooks.columns.active')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {webhooks.map((webhook) => (
                  <tr key={webhook.id}>
                    <td>{webhook.name}</td>
                    <td>
                      <code>{webhook.url}</code>
                    </td>
                    <td>{t('messages.webhooks.eventCount', { count: webhook.events.length })}</td>
                    <td>{webhook.isActive ? t('messages.common.yes') : t('messages.common.no')}</td>
                    <td>
                      <Link route="webhooks.show" routeParams={{ id: webhook.id }}>
                        {t('messages.common.details')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </AppLayout>
  )
}
