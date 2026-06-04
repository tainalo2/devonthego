import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type Webhook = {
  id: number
  name: string
  url: string
  events: string[]
  isActive: boolean
}

type Props = {
  webhook: Webhook
  availableEvents: string[]
}

export default function WebhooksEdit({ webhook, availableEvents }: Props) {
  const { t, webhookEventLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.webhooks.editTitle', { name: webhook.name })}</h1>
          <Link route="webhooks.show" routeParams={{ id: webhook.id }}>
            {t('messages.common.back')}
          </Link>
        </div>

        <section className="card form-card">
          <Form route="webhooks.update" routeParams={{ id: webhook.id }} className="form">
            {({ errors }) => (
              <>
                <label>
                  {t('messages.common.name')}
                  <input type="text" name="name" defaultValue={webhook.name} required />
                </label>

                <label>
                  {t('messages.common.url')}
                  <input type="url" name="url" defaultValue={webhook.url} required />
                  {errors.url && <span className="error">{errors.url}</span>}
                </label>

                <label>
                  {t('messages.webhooks.form.newSecret')}
                  <input type="text" name="secret" />
                </label>

                <fieldset className="checkbox-group">
                  <legend>{t('messages.webhooks.show.events')}</legend>
                  {availableEvents.map((event) => (
                    <label key={event} className="checkbox">
                      <input
                        type="checkbox"
                        name="events[]"
                        value={event}
                        defaultChecked={webhook.events.includes(event)}
                      />
                      <code>{event}</code> — {webhookEventLabel(event)}
                    </label>
                  ))}
                </fieldset>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="1"
                    defaultChecked={webhook.isActive}
                  />
                  {t('messages.webhooks.form.activeWebhook')}
                </label>

                <button type="submit" className="btn btn-primary">
                  {t('messages.common.save')}
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
