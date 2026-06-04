import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type Webhook = {
  id: number
  name: string
  url: string
  secret: string | null
  events: string[]
  isActive: boolean
  createdAt: string
}

type Delivery = {
  id: number
  event: string
  success: boolean
  responseStatus: number | null
  responseBody: string | null
  createdAt: string
}

type Props = {
  webhook: Webhook
  deliveries: Delivery[]
}

export default function WebhooksShow({ webhook, deliveries }: Props) {
  const { t, webhookEventLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>{webhook.name}</h1>
            <p className="muted">
              <code>{webhook.url}</code>
            </p>
          </div>
          <div className="actions-row">
            <Link route="webhooks.edit" routeParams={{ id: webhook.id }} className="btn">
              {t('messages.common.edit')}
            </Link>
            <Link route="webhooks.index">{t('messages.common.back')}</Link>
          </div>
        </div>

        <div className="detail-grid">
          <section className="card">
            <h2>{t('messages.webhooks.show.config')}</h2>
            <dl className="detail-list">
              <div>
                <dt>{t('messages.webhooks.show.secret')}</dt>
                <dd>
                  <code>{webhook.secret}</code>
                </dd>
              </div>
              <div>
                <dt>{t('messages.webhooks.show.events')}</dt>
                <dd>
                  {webhook.events.map((e) => (
                    <div key={e}>
                      <code>{e}</code> — {webhookEventLabel(e)}
                    </div>
                  ))}
                </dd>
              </div>
              <div>
                <dt>{t('messages.webhooks.show.active')}</dt>
                <dd>{webhook.isActive ? t('messages.common.yes') : t('messages.common.no')}</dd>
              </div>
            </dl>
            <p className="muted small">{t('messages.webhooks.show.signatureHint')}</p>
          </section>
        </div>

        <section className="card">
          <h2>{t('messages.webhooks.show.recentDeliveries')}</h2>
          {deliveries.length === 0 ? (
            <p className="muted">{t('messages.webhooks.show.noDeliveries')}</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>{t('messages.webhooks.show.deliveryColumns.date')}</th>
                  <th>{t('messages.webhooks.show.deliveryColumns.event')}</th>
                  <th>{t('messages.webhooks.show.deliveryColumns.httpStatus')}</th>
                  <th>{t('messages.webhooks.show.deliveryColumns.success')}</th>
                </tr>
              </thead>
              <tbody>
                {deliveries.map((d) => (
                  <tr key={d.id}>
                    <td>{d.createdAt}</td>
                    <td>
                      <code>{d.event}</code>
                    </td>
                    <td>{d.responseStatus ?? '—'}</td>
                    <td>{d.success ? '✓' : '✗'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <Form route="webhooks.destroy" routeParams={{ id: webhook.id }} className="danger-zone">
          <button type="submit" className="btn btn-danger">
            {t('messages.webhooks.show.deleteWebhook')}
          </button>
        </Form>
      </div>
    </AppLayout>
  )
}
