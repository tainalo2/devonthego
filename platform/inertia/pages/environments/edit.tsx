import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

type Environment = {
  id: number
  name: string
  cpuLimit: number
  memoryLimitMb: number
  gitRepoUrl: string | null
  gitBranch: string | null
  status: string
}

type Props = {
  environment: Environment
}

export default function EnvironmentsEdit({ environment }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Modifier {environment.name}</h1>
          <Link route="environments.show" routeParams={{ id: environment.id }}>
            Retour
          </Link>
        </div>

        <section className="card form-card">
          <p className="muted">
            Statut actuel : <span className={`badge badge-${environment.status}`}>{environment.status}</span>
            {' — '}
            un changement de CPU/RAM recréera le conteneur s&apos;il est en cours d&apos;exécution.
          </p>

          <Form route="environments.update" routeParams={{ id: environment.id }} className="form">
            {({ errors }) => (
              <>
                <label>
                  Nom
                  <input type="text" name="name" defaultValue={environment.name} required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <div className="form-row">
                  <label>
                    CPU (cores)
                    <input
                      type="number"
                      name="cpuLimit"
                      min={1}
                      max={8}
                      defaultValue={environment.cpuLimit}
                    />
                  </label>
                  <label>
                    RAM (Mo)
                    <input
                      type="number"
                      name="memoryLimitMb"
                      min={256}
                      max={16384}
                      defaultValue={environment.memoryLimitMb}
                    />
                  </label>
                </div>

                <label>
                  URL dépôt Git (optionnel)
                  <input
                    type="url"
                    name="gitRepoUrl"
                    defaultValue={environment.gitRepoUrl ?? ''}
                    placeholder="https://github.com/user/repo.git"
                  />
                </label>

                <label>
                  Branche Git
                  <input
                    type="text"
                    name="gitBranch"
                    defaultValue={environment.gitBranch ?? ''}
                    placeholder="main"
                  />
                </label>

                <button type="submit" className="btn btn-primary">
                  Enregistrer
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
