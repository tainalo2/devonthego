import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type UserItem = {
  id: number
  email: string
  fullName: string | null
  role: string
  isActive: boolean
  createdAt: string
}

type Props = {
  users: UserItem[]
}

export default function UsersIndex({ users }: Props) {
  const { t, roleLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.users.title')}</h1>
          <Link route="users.create" className="btn btn-primary">
            {t('messages.users.new')}
          </Link>
        </div>

        <section className="card">
          <table className="table">
            <thead>
              <tr>
                <th>{t('messages.users.columns.email')}</th>
                <th>{t('messages.users.columns.name')}</th>
                <th>{t('messages.users.columns.role')}</th>
                <th>{t('messages.users.columns.active')}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.fullName ?? '—'}</td>
                  <td>
                    <span className={`badge badge-${user.role}`}>{roleLabel(user.role)}</span>
                  </td>
                  <td>{user.isActive ? t('messages.common.yes') : t('messages.common.no')}</td>
                  <td>
                    <Link route="users.edit" routeParams={{ id: user.id }}>
                      {t('messages.common.edit')}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppLayout>
  )
}
