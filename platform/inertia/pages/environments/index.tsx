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
  owner: { id: number; email: string; fullName: string | null }
  imageTemplate: { id: number; name: string } | null
  cpuLimit: number
  memoryLimitMb: number
  createdAt: string
}

type Props = {
  environments: EnvironmentItem[]
}

export default function EnvironmentsIndex({ environments }: Props) {
  const { t, statusLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.environments.title')}</h1>
          <Link route="environments.create" className="btn btn-primary">
            {t('messages.environments.new')}
          </Link>
        </div>

        <section className="card">
          {environments.length === 0 ? (
            <p className="muted">{t('messages.environments.none')}</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>{t('messages.environments.columns.name')}</th>
                  <th>{t('messages.environments.columns.status')}</th>
                  <th>{t('messages.environments.columns.image')}</th>
                  <th>{t('messages.environments.columns.owner')}</th>
                  <th>{t('messages.environments.columns.resources')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {environments.map((env) => (
                  <tr key={env.id}>
                    <td>{env.name}</td>
                    <td>
                      <span className={`badge badge-${env.status}`}>{statusLabel(env.status)}</span>
                    </td>
                    <td>{env.imageTemplate?.name ?? t('messages.common.custom')}</td>
                    <td>{env.owner.email}</td>
                    <td>
                      {env.cpuLimit} CPU / {env.memoryLimitMb} MB
                    </td>
                    <td>
                      <Link route="environments.show" routeParams={{ id: env.id }}>
                        {t('messages.common.open')}
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
