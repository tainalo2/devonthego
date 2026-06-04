import AppLayout from '~/layouts/app'

type Template = {
  id: number
  name: string
  slug: string
  dockerImage: string
  description: string | null
  isDefault: boolean
  isBuiltin: boolean
  createdAt: string
}

type Props = {
  templates: Template[]
}

export default function ImagesIndex({ templates }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Images Docker</h1>
        </div>

        <section className="card">
          <p className="muted">
            Images disponibles dans le registry local. Utilisez{' '}
            <code>images/build-image.sh</code> pour en créer de nouvelles.
          </p>
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Image Docker</th>
                <th>Description</th>
                <th>Défaut</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((template) => (
                <tr key={template.id}>
                  <td>{template.name}</td>
                  <td>
                    <code>{template.dockerImage}</code>
                  </td>
                  <td>{template.description ?? '—'}</td>
                  <td>{template.isDefault ? 'Oui' : 'Non'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </AppLayout>
  )
}
