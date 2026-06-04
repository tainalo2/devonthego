import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'

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
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Utilisateurs</h1>
          <Link route="users.create" className="btn btn-primary">
            Nouvel utilisateur
          </Link>
        </div>

        <section className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Nom</th>
                <th>Rôle</th>
                <th>Actif</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.fullName ?? '—'}</td>
                  <td>
                    <span className={`badge badge-${user.role}`}>{user.role}</span>
                  </td>
                  <td>{user.isActive ? 'Oui' : 'Non'}</td>
                  <td>
                    <Link route="users.edit" routeParams={{ id: user.id }}>
                      Modifier
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
