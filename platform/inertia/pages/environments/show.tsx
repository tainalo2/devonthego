import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

type Environment = {
  id: number
  name: string
  slug: string
  status: string
  subdomain: string
  url: string
  dockerImage: string
  cpuLimit: number
  memoryLimitMb: number
  errorMessage: string | null
  owner: { id: number; email: string; fullName: string | null }
  imageTemplate: { id: number; name: string } | null
  assignedUsers: { id: number; email: string; fullName: string | null }[]
  createdAt: string
}

type Log = {
  id: number
  level: string
  message: string
  createdAt: string
}

type Props = {
  environment: Environment
  credentials: { username: string; password: string } | null
  logs: Log[]
  domain: string
}

export default function EnvironmentShow({ environment, credentials, logs }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>{environment.name}</h1>
            <p className="muted">{environment.slug}</p>
          </div>
          <Link route="environments.index">Retour</Link>
        </div>

        <div className="detail-grid">
          <section className="card">
            <h2>Informations</h2>
            <dl className="detail-list">
              <div>
                <dt>Statut</dt>
                <dd>
                  <span className={`badge badge-${environment.status}`}>{environment.status}</span>
                </dd>
              </div>
              <div>
                <dt>URL</dt>
                <dd>
                  <a href={environment.url} target="_blank" rel="noreferrer">
                    {environment.url}
                  </a>
                </dd>
              </div>
              <div>
                <dt>Image Docker</dt>
                <dd>{environment.dockerImage}</dd>
              </div>
              <div>
                <dt>Propriétaire</dt>
                <dd>{environment.owner.email}</dd>
              </div>
              <div>
                <dt>Ressources</dt>
                <dd>
                  {environment.cpuLimit} CPU / {environment.memoryLimitMb} Mo
                </dd>
              </div>
              {environment.errorMessage && (
                <div>
                  <dt>Erreur</dt>
                  <dd className="text-error">{environment.errorMessage}</dd>
                </div>
              )}
            </dl>

            <div className="actions-row">
              <Form route="environments.start" routeParams={{ id: environment.id }}>
                <button type="submit" className="btn">
                  Démarrer
                </button>
              </Form>
              <Form route="environments.stop" routeParams={{ id: environment.id }}>
                <button type="submit" className="btn">
                  Arrêter
                </button>
              </Form>
              <Form route="environments.regenerateCredentials" routeParams={{ id: environment.id }}>
                <button type="submit" className="btn">
                  Régénérer identifiants
                </button>
              </Form>
              <Form route="environments.destroy" routeParams={{ id: environment.id }}>
                <button type="submit" className="btn btn-danger">
                  Supprimer
                </button>
              </Form>
            </div>
          </section>

          <section className="card">
            <h2>Authentification (Basic Auth)</h2>
            {credentials ? (
              <dl className="detail-list">
                <div>
                  <dt>Utilisateur</dt>
                  <dd>
                    <code>{credentials.username}</code>
                  </dd>
                </div>
                <div>
                  <dt>Mot de passe</dt>
                  <dd>
                    <code>{credentials.password}</code>
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="muted">
                Les identifiants ne sont affichés qu&apos;à la création ou après régénération.
              </p>
            )}
          </section>
        </div>

        <section className="card">
          <h2>Journal</h2>
          {logs.length === 0 ? (
            <p className="muted">Aucun événement.</p>
          ) : (
            <ul className="log-list">
              {logs.map((log) => (
                <li key={log.id} className={`log-${log.level}`}>
                  <time>{log.createdAt}</time>
                  <span>{log.message}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AppLayout>
  )
}
