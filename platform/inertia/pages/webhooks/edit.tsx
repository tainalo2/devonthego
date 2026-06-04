import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

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
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Modifier {webhook.name}</h1>
          <Link route="webhooks.show" routeParams={{ id: webhook.id }}>
            Retour
          </Link>
        </div>

        <section className="card form-card">
          <Form route="webhooks.update" routeParams={{ id: webhook.id }} className="form">
            {({ errors }) => (
              <>
                <label>
                  Nom
                  <input type="text" name="name" defaultValue={webhook.name} required />
                </label>

                <label>
                  URL
                  <input type="url" name="url" defaultValue={webhook.url} required />
                  {errors.url && <span className="error">{errors.url}</span>}
                </label>

                <label>
                  Nouveau secret (laisser vide pour conserver)
                  <input type="text" name="secret" />
                </label>

                <fieldset className="checkbox-group">
                  <legend>Événements</legend>
                  {availableEvents.map((event) => (
                    <label key={event} className="checkbox">
                      <input
                        type="checkbox"
                        name="events[]"
                        value={event}
                        defaultChecked={webhook.events.includes(event)}
                      />
                      <code>{event}</code>
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
                  Webhook actif
                </label>

                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
