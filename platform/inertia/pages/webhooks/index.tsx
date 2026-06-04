import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'

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
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Webhooks</h1>
          <Link route="webhooks.create" className="btn btn-primary">
            Nouveau webhook
          </Link>
        </div>

        <section className="card">
          <p className="muted">
            Recevez des notifications HTTP lors des changements d&apos;état des environnements.
          </p>
          {webhooks.length === 0 ? (
            <p className="muted">Aucun webhook configuré.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>URL</th>
                  <th>Événements</th>
                  <th>Actif</th>
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
                    <td>{webhook.events.length} événement(s)</td>
                    <td>{webhook.isActive ? 'Oui' : 'Non'}</td>
                    <td>
                      <Link route="webhooks.show" routeParams={{ id: webhook.id }}>
                        Détails
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
