import AppLayout from '~/layouts/app'
import { Link } from '@adonisjs/inertia/react'

type Template = {
  id: number
  name: string
  slug: string
  dockerImage: string
  description: string | null
  isDefault: boolean
  isBuiltin: boolean
  buildStatus: string
  buildError: string | null
  lastBuiltAt: string | null
  createdAt: string
}

type Props = {
  templates: Template[]
}

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    idle: 'Non buildé',
    building: 'Build en cours',
    success: 'Prêt',
    error: 'Erreur',
  }
  return labels[status] ?? status
}

export default function ImagesIndex({ templates }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Images Docker</h1>
          <Link route="images.create" className="btn btn-primary">
            Nouveau template
          </Link>
        </div>

        <section className="card">
          <p className="muted">
            Registry local : images disponibles pour vos environnements de dev.
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Image Docker</th>
                <th>Build</th>
                <th>Défaut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>
                    {template.name}
                    {template.isBuiltin && <span className="badge badge-user">builtin</span>}
                  </td>
                  <td>
                    <code>{template.dockerImage}</code>
                  </td>
                  <td>
                    <span className={`badge badge-${template.buildStatus === 'success' ? 'running' : template.buildStatus}`}>
                      {statusLabel(template.buildStatus)}
                    </span>
                    {template.buildError && (
                      <p className="text-error small">{template.buildError}</p>
                    )}
                  </td>
                  <td>{template.isDefault ? 'Oui' : 'Non'}</td>
                  <td>
                    <Link route="images.show" routeParams={{ id: template.id }}>
                      Détails
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
