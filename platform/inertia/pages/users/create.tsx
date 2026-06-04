import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

export default function UsersCreate() {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Nouvel utilisateur</h1>
          <Link route="users.index">Retour</Link>
        </div>

        <section className="card form-card">
          <Form route="users.store" className="form">
            {({ errors }) => (
              <>
                <label>
                  Nom complet
                  <input type="text" name="fullName" />
                </label>
                <label>
                  Email
                  <input type="email" name="email" required />
                  {errors.email && <span className="error">{errors.email}</span>}
                </label>
                <label>
                  Mot de passe
                  <input type="password" name="password" required />
                  {errors.password && <span className="error">{errors.password}</span>}
                </label>
                <label>
                  Rôle
                  <select name="role" defaultValue="user">
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </label>
                <label className="checkbox">
                  <input type="checkbox" name="isActive" value="1" defaultChecked />
                  Compte actif
                </label>
                <button type="submit" className="btn btn-primary">
                  Créer
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
