import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

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
              Modifier
            </Link>
            <Link route="webhooks.index">Retour</Link>
          </div>
        </div>

        <div className="detail-grid">
          <section className="card">
            <h2>Configuration</h2>
            <dl className="detail-list">
              <div>
                <dt>Secret (HMAC SHA-256)</dt>
                <dd>
                  <code>{webhook.secret}</code>
                </dd>
              </div>
              <div>
                <dt>Événements</dt>
                <dd>
                  {webhook.events.map((e) => (
                    <div key={e}>
                      <code>{e}</code>
                    </div>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Actif</dt>
                <dd>{webhook.isActive ? 'Oui' : 'Non'}</dd>
              </div>
            </dl>
            <p className="muted small">
              Signature envoyée dans l&apos;en-tête <code>X-DOTG-Signature: sha256=…</code>
            </p>
          </section>
        </div>

        <section className="card">
          <h2>Dernières livraisons</h2>
          {deliveries.length === 0 ? (
            <p className="muted">Aucune livraison pour le moment.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Événement</th>
                  <th>Statut HTTP</th>
                  <th>Succès</th>
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
            Supprimer le webhook
          </button>
        </Form>
      </div>
    </AppLayout>
  )
}
