import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type Props = {
  availableEvents: string[]
}

export default function WebhooksCreate({ availableEvents }: Props) {
  const { t, webhookEventLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.webhooks.createTitle')}</h1>
          <Link route="webhooks.index">{t('messages.common.back')}</Link>
        </div>

        <section className="card form-card">
          <Form route="webhooks.store" className="form">
            {({ errors }) => (
              <>
                <label>
                  {t('messages.common.name')}
                  <input type="text" name="name" required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                  {t('messages.webhooks.form.destinationUrl')}
                  <input type="url" name="url" placeholder="https://example.com/webhook" required />
                  {errors.url && <span className="error">{errors.url}</span>}
                </label>

                <label>
                  {t('messages.webhooks.form.secretOptional')}
                  <input type="text" name="secret" />
                </label>

                <fieldset className="checkbox-group">
                  <legend>{t('messages.webhooks.form.eventsListen')}</legend>
                  {availableEvents.map((event) => (
                    <label key={event} className="checkbox">
                      <input type="checkbox" name="events[]" value={event} defaultChecked />
                      <code>{event}</code> — {webhookEventLabel(event)}
                    </label>
                  ))}
                </fieldset>

                <label className="checkbox">
                  <input type="checkbox" name="isActive" value="1" defaultChecked />
                  {t('messages.webhooks.form.activeWebhook')}
                </label>

                <button type="submit" className="btn btn-primary">
                  {t('messages.common.create')}
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
