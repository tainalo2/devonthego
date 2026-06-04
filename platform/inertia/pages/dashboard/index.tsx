import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

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
  const { t, statusLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.dashboard.title')}</h1>
          <Link route="environments.create" className="btn btn-primary">
            {t('messages.dashboard.newEnvironment')}
          </Link>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">{t('messages.dashboard.stats.environments')}</span>
            <strong>{stats.environmentsTotal}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('messages.dashboard.stats.running')}</span>
            <strong>{stats.environmentsRunning}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('messages.dashboard.stats.users')}</span>
            <strong>{stats.usersTotal}</strong>
          </div>
          <div className="stat-card">
            <span className="stat-label">{t('messages.dashboard.stats.docker')}</span>
            <strong className={stats.dockerOnline ? 'text-success' : 'text-error'}>
              {stats.dockerOnline ? t('messages.common.online') : t('messages.common.offline')}
            </strong>
          </div>
        </div>

        <section className="card">
          <h2>{t('messages.dashboard.recentEnvironments')}</h2>
          {environments.length === 0 ? (
            <p className="muted">{t('messages.dashboard.noEnvironments')}</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>{t('messages.dashboard.columns.name')}</th>
                  <th>{t('messages.dashboard.columns.status')}</th>
                  <th>{t('messages.dashboard.columns.url')}</th>
                  <th>{t('messages.dashboard.columns.owner')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {environments.map((env) => (
                  <tr key={env.id}>
                    <td>{env.name}</td>
                    <td>
                      <span className={statusClass(env.status)}>{statusLabel(env.status)}</span>
                    </td>
                    <td>
                      <a href={env.url} target="_blank" rel="noreferrer">
                        {env.subdomain}.{stats.domain}
                      </a>
                    </td>
                    <td>{env.owner?.email}</td>
                    <td>
                      <Link route="environments.show" routeParams={{ id: env.id }}>
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
