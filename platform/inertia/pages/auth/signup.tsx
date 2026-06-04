import PublicLayout from '~/layouts/public'
import { Form, Link } from '@adonisjs/inertia/react'

export default function Signup() {
  return (
    <PublicLayout>
      <div className="form-container">
        <div>
          <h1>Inscription</h1>
          <p>Créez votre compte Dev on the go.</p>
        </div>

        <Form route="new_account.store">
          {({ errors }) => (
            <>
              <div>
                <label htmlFor="fullName">Nom complet</label>
                <input type="text" name="fullName" id="fullName" />
                {errors.fullName && <div>{errors.fullName}</div>}
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" autoComplete="email" />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">Mot de passe</label>
                <input type="password" name="password" id="password" autoComplete="new-password" />
                {errors.password && <div>{errors.password}</div>}
              </div>

              <div>
                <label htmlFor="passwordConfirmation">Confirmer le mot de passe</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                />
                {errors.passwordConfirmation && <div>{errors.passwordConfirmation}</div>}
              </div>

              <div>
                <button type="submit" className="btn btn-primary">
                  S&apos;inscrire
                </button>
              </div>
              <p>
                Déjà un compte ? <Link route="session.create">Se connecter</Link>
              </p>
            </>
          )}
        </Form>
      </div>
    </PublicLayout>
  )
}
