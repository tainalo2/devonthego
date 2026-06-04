import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

type User = {
  id: number
  email: string
  fullName: string | null
  role: 'admin' | 'user'
  isActive: boolean
}

type Props = {
  user: User
}

export default function UsersEdit({ user }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Modifier {user.email}</h1>
          <Link route="users.index">Retour</Link>
        </div>

        <section className="card form-card">
          <Form route="users.update" routeParams={{ id: user.id }} className="form">
            {({ errors }) => (
              <>
                <label>
                  Nom complet
                  <input type="text" name="fullName" defaultValue={user.fullName ?? ''} />
                </label>
                <label>
                  Email
                  <input type="email" name="email" defaultValue={user.email} required />
                  {errors.email && <span className="error">{errors.email}</span>}
                </label>
                <label>
                  Nouveau mot de passe (optionnel)
                  <input type="password" name="password" />
                </label>
                <label>
                  Rôle
                  <select name="role" defaultValue={user.role}>
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="1"
                    defaultChecked={user.isActive}
                  />
                  Compte actif
                </label>
                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </>
            )}
          </Form>

          <Form route="users.destroy" routeParams={{ id: user.id }} className="danger-zone">
            <button type="submit" className="btn btn-danger">
              Supprimer l&apos;utilisateur
            </button>
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
