import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'

type EnvironmentItem = {
  id: number
  name: string
  slug: string
  status: string
  subdomain: string
  url: string
  owner: { id: number; email: string; fullName: string | null } | null
  imageTemplate: { id: number; name: string } | null
  createdAt: string
}

type Stats = {
  environmentsTotal: number
  environmentsRunning: number
  usersTotal: number
  templatesTotal: number
  dockerOnline: boolean
  domain: string
}

type Props = {
  environments: EnvironmentItem[]
  stats: Stats
}

function statusClass(status: string) {
  return `badge badge-${status}`
}

export default function Dashboard({ environments, stats }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Tableau de bord</h1>
          <Link route="environments.create" className="btn btn-primary">
            Nouvel environnement
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Environnements</span>
            <strong>{stats.environmentsTotal}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">En cours</span>
            <strong>{stats.environmentsRunning}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Utilisateurs</span>
            <strong>{stats.usersTotal}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">Docker</span>
            <strong className={stats.dockerOnline ? 'text-success' : 'text-error'}>
              {stats.dockerOnline ? 'En ligne' : 'Hors ligne'}
            </strong>
          </div>
        </div>

        <section className="card">
          <h2>Environnements récents</h2>
          {environments.length === 0 ? (
            <p className="muted">Aucun environnement pour le moment.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Statut</th>
                  <th>URL</th>
                  <th>Propriétaire</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {environments.map((env) => (
                  <tr key={env.id}>
                    <td>{env.name}</td>
                    <td>
                      <span className={statusClass(env.status)}>{env.status}</span>
                    </td>
                    <td>
                      <a href={env.url} target="_blank" rel="noreferrer">
                        {env.subdomain}.{stats.domain}
                      </a>
                    </td>
                    <td>{env.owner?.email}</td>
                    <td>
                      <Link route="environments.show" routeParams={{ id: env.id }}>
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
