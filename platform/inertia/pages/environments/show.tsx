import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

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
  gitRepoUrl: string | null
  gitBranch: string | null
  createdAt: string
}

type Log = {
  id: number
  level: string
  message: string
  createdAt: string
}

type AvailableUser = {
  id: number
  email: string
  fullName: string | null
  assigned: boolean
}

type Props = {
  environment: Environment
  credentials: { username: string; password: string } | null
  logs: Log[]
  dockerLogs: string | null
  canManage: boolean
  availableUsers: AvailableUser[]
  domain: string
}

export default function EnvironmentShow({
  environment,
  credentials,
  logs,
  dockerLogs,
  canManage,
  availableUsers,
}: Props) {
  const { t, statusLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <div>
            <h1>{environment.name}</h1>
            <p className="muted">{environment.slug}</p>
          </div>
          <div className="actions-row">
            {canManage && (
              <Link route="environments.edit" routeParams={{ id: environment.id }} className="btn">
                {t('messages.common.edit')}
              </Link>
            )}
            <Link route="environments.index">{t('messages.common.back')}</Link>
          </div>
        </div>

        <div className="detail-grid">
          <section className="card">
            <h2>{t('messages.environments.show.info')}</h2>
            <dl className="detail-list">
              <div>
                <dt>{t('messages.common.status')}</dt>
                <dd>
                  <span className={`badge badge-${environment.status}`}>
                    {statusLabel(environment.status)}
                  </span>
                </dd>
              </div>
              <div>
                <dt>{t('messages.common.url')}</dt>
                <dd>
                  <a href={environment.url} target="_blank" rel="noreferrer">
                    {environment.url}
                  </a>
                </dd>
              </div>
              <div>
                <dt>{t('messages.environments.show.dockerImage')}</dt>
                <dd>
                  <code>{environment.dockerImage}</code>
                </dd>
              </div>
              <div>
                <dt>{t('messages.common.owner')}</dt>
                <dd>{environment.owner.email}</dd>
              </div>
              <div>
                <dt>{t('messages.environments.show.assignedUsers')}</dt>
                <dd>
                  {environment.assignedUsers.length === 0 ? (
                    <span className="muted">{t('messages.common.none')}</span>
                  ) : (
                    environment.assignedUsers.map((u) => u.email).join(', ')
                  )}
                </dd>
              </div>
              {(environment.gitRepoUrl || environment.gitBranch) && (
                <div>
                  <dt>{t('messages.environments.show.git')}</dt>
                  <dd>
                    {environment.gitRepoUrl && (
                      <div>
                        <code>{environment.gitRepoUrl}</code>
                      </div>
                    )}
                    {environment.gitBranch && (
                      <span className="muted">
                        {t('messages.environments.show.branchPrefix')} {environment.gitBranch}
                      </span>
                    )}
                  </dd>
                </div>
              )}
              <div>
                <dt>{t('messages.common.resources')}</dt>
                <dd>
                  {environment.cpuLimit} CPU / {environment.memoryLimitMb} MB
                </dd>
              </div>
              {environment.errorMessage && (
                <div>
                  <dt>{t('messages.common.error')}</dt>
                  <dd className="text-error">{environment.errorMessage}</dd>
                </div>
              )}
            </dl>

            {canManage && (
              <div className="actions-row">
                <Form route="environments.start" routeParams={{ id: environment.id }}>
                  <button type="submit" className="btn">
                    {t('messages.environments.show.start')}
                  </button>
                </Form>
                <Form route="environments.stop" routeParams={{ id: environment.id }}>
                  <button type="submit" className="btn">
                    {t('messages.environments.show.stop')}
                  </button>
                </Form>
                <Form route="environments.regenerateCredentials" routeParams={{ id: environment.id }}>
                  <button type="submit" className="btn">
                    {t('messages.environments.show.regenerateCredentials')}
                  </button>
                </Form>
                <Form route="environments.destroy" routeParams={{ id: environment.id }}>
                  <button type="submit" className="btn btn-danger">
                    {t('messages.common.delete')}
                  </button>
                </Form>
              </div>
            )}
          </section>

          <section className="card">
            <h2>{t('messages.environments.show.auth')}</h2>
            {credentials ? (
              <dl className="detail-list">
                <div>
                  <dt>{t('messages.environments.show.username')}</dt>
                  <dd>
                    <code>{credentials.username}</code>
                  </dd>
                </div>
                <div>
                  <dt>{t('messages.common.password')}</dt>
                  <dd>
                    <code>{credentials.password}</code>
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="muted">{t('messages.environments.show.credentialsHint')}</p>
            )}
          </section>
        </div>

        {canManage && availableUsers.length > 0 && (
          <section className="card form-card">
            <h2>{t('messages.environments.show.assignUsers')}</h2>
            <Form route="environments.assignUsers" routeParams={{ id: environment.id }} className="form">
              <fieldset className="checkbox-group">
                {availableUsers.map((user) => (
                  <label key={user.id} className="checkbox">
                    <input
                      type="checkbox"
                      name="assignedUserIds[]"
                      value={user.id}
                      defaultChecked={user.assigned}
                    />
                    {user.email}
                  </label>
                ))}
              </fieldset>
              <button type="submit" className="btn btn-primary">
                {t('messages.environments.show.saveAssignments')}
              </button>
            </Form>
          </section>
        )}

        <section className="card">
          <h2>{t('messages.environments.show.platformLog')}</h2>
          {logs.length === 0 ? (
            <p className="muted">{t('messages.environments.show.noEvents')}</p>
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

        {dockerLogs && (
          <section className="card">
            <h2>{t('messages.environments.show.dockerLogs')}</h2>
            <pre className="docker-logs">{dockerLogs}</pre>
          </section>
        )}
      </div>
    </AppLayout>
  )
}
