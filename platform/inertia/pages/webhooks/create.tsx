import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

type Props = {
  availableEvents: string[]
}

export default function WebhooksCreate({ availableEvents }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Nouveau webhook</h1>
          <Link route="webhooks.index">Retour</Link>
        </div>

        <section className="card form-card">
          <Form route="webhooks.store" className="form">
            {({ errors }) => (
              <>
                <label>
                  Nom
                  <input type="text" name="name" required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                  URL de destination
                  <input type="url" name="url" placeholder="https://example.com/webhook" required />
                  {errors.url && <span className="error">{errors.url}</span>}
                </label>

                <label>
                  Secret (optionnel — généré automatiquement si vide)
                  <input type="text" name="secret" />
                </label>

                <fieldset className="checkbox-group">
                  <legend>Événements à écouter</legend>
                  {availableEvents.map((event) => (
                    <label key={event} className="checkbox">
                      <input type="checkbox" name="events[]" value={event} defaultChecked />
                      <code>{event}</code>
                    </label>
                  ))}
                </fieldset>

                <label className="checkbox">
                  <input type="checkbox" name="isActive" value="1" defaultChecked />
                  Webhook actif
                </label>

                <button type="submit" className="btn btn-primary">
                  Créer
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
