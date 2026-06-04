import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

type Template = {
  id: number
  name: string
  slug: string
  dockerImage: string
  description: string | null
  isDefault: boolean
  buildStatus: string
}

type UserOption = {
  id: number
  email: string
  fullName: string | null
  role: string
}

type Props = {
  templates: Template[]
  users: UserOption[]
  defaults: { cpuLimit: number; memoryLimitMb: number }
}

export default function EnvironmentsCreate({ templates, users, defaults }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Nouvel environnement</h1>
          <Link route="environments.index">Retour</Link>
        </div>

        <section className="card form-card">
          <Form route="environments.store" className="form">
            {({ errors }) => (
              <>
                <label>
                  Nom
                  <input type="text" name="name" required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                  Template d&apos;image
                  <select name="imageTemplateId" defaultValue={templates.find((t) => t.isDefault)?.id}>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                        {template.buildStatus !== 'success' && template.buildStatus !== 'idle'
                          ? ` (${template.buildStatus})`
                          : ''}
                      </option>
                    ))}
                  </select>
                </label>

                {users.length > 0 && (
                  <>
                    <label>
                      Propriétaire
                      <select name="ownerId" defaultValue="">
                        <option value="">Moi-même</option>
                        {users.map((user) => (
                          <option key={user.id} value={user.id}>
                            {user.email} ({user.role})
                          </option>
                        ))}
                      </select>
                    </label>

                    <fieldset className="checkbox-group">
                      <legend>Utilisateurs assignés (accès partagé)</legend>
                      {users.map((user) => (
                        <label key={user.id} className="checkbox">
                          <input type="checkbox" name="assignedUserIds[]" value={user.id} />
                          {user.email}
                        </label>
                      ))}
                    </fieldset>
                  </>
                )}

                <div className="form-row">
                  <label>
                    CPU (cores)
                    <input
                      type="number"
                      name="cpuLimit"
                      min={1}
                      max={8}
                      defaultValue={defaults.cpuLimit}
                    />
                  </label>
                  <label>
                    RAM (Mo)
                    <input
                      type="number"
                      name="memoryLimitMb"
                      min={256}
                      max={16384}
                      defaultValue={defaults.memoryLimitMb}
                    />
                  </label>
                </div>

                <fieldset className="checkbox-group">
                  <legend>Import Git (optionnel)</legend>
                  <label>
                    URL du dépôt
                    <input
                      type="url"
                      name="gitRepoUrl"
                      placeholder="https://github.com/user/mon-projet.git"
                    />
                    {errors.gitRepoUrl && <span className="error">{errors.gitRepoUrl}</span>}
                  </label>
                  <label>
                    Branche
                    <input type="text" name="gitBranch" placeholder="main" />
                  </label>
                  <p className="muted small">
                    Le dépôt sera cloné dans le workspace au premier démarrage (si vide).
                  </p>
                </fieldset>

                <button type="submit" className="btn btn-primary">
                  Créer l&apos;environnement
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
