import PublicLayout from '~/layouts/public'
import { Form, Link } from '@adonisjs/inertia/react'

type Props = {
  bootstrapMode?: boolean
}

export default function Login({ bootstrapMode = false }: Props) {
  return (
    <PublicLayout>
      <div className="form-container">
        <div>
          <h1>Connexion</h1>
          <p>Connectez-vous à votre espace Dev on the go.</p>
          {bootstrapMode && (
            <p className="muted">
              Première installation ? Utilisez les identifiants affichés par <code>install.sh</code>,
              puis suivez l&apos;assistant de configuration.
            </p>
          )}
        </div>

        <Form route="session.store">
          {({ errors }) => (
            <>
              <div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" autoComplete="username" />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                />
                {errors.password && <span>{errors.password}</span>}
              </div>

              <div>
                <button type="submit" className="btn btn-primary">
                  Se connecter
                </button>
              </div>
              <p>
                Pas de compte ? <Link route="new_account.create">S&apos;inscrire</Link>
              </p>
            </>
          )}
        </Form>
      </div>
    </PublicLayout>
  )
}
