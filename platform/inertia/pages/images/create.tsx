import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'

type Props = {
  defaultDockerfile: string
}

export default function ImagesCreate({ defaultDockerfile }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Nouveau template d&apos;image</h1>
          <Link route="images.index">Retour</Link>
        </div>

        <section className="card form-card">
          <Form route="images.store" className="form">
            {({ errors }) => (
              <>
                <label>
                  Nom
                  <input type="text" name="name" required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                  Description
                  <input type="text" name="description" />
                </label>

                <label>
                  Dockerfile
                  <textarea name="dockerfile" rows={12} defaultValue={defaultDockerfile} />
                  {errors.dockerfile && <span className="error">{errors.dockerfile}</span>}
                </label>

                <label className="checkbox">
                  <input type="checkbox" name="isDefault" value="1" />
                  Template par défaut
                </label>

                <button type="submit" className="btn btn-primary">
                  Créer le template
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
