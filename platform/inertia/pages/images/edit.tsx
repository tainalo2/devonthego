import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

type Template = {
  id: number
  name: string
  slug: string
  description: string | null
  dockerfile: string
  isDefault: boolean
  isBuiltin: boolean
}

type Props = {
  template: Template
}

export default function ImagesEdit({ template }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Modifier {template.name}</h1>
          <Link route="images.show" routeParams={{ id: template.id }}>
            Retour
          </Link>
        </div>

        <section className="card form-card">
          <Form route="images.update" routeParams={{ id: template.id }} className="form">
            {({ errors }) => (
              <>
                <label>
                  Nom
                  <input type="text" name="name" defaultValue={template.name} required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                  Description
                  <input type="text" name="description" defaultValue={template.description ?? ''} />
                </label>

                <label>
                  Dockerfile
                  <textarea name="dockerfile" rows={14} defaultValue={template.dockerfile} />
                </label>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="isDefault"
                    value="1"
                    defaultChecked={template.isDefault}
                  />
                  Template par défaut
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
