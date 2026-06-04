import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

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
  const { t } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.images.editTitle', { name: template.name })}</h1>
          <Link route="images.show" routeParams={{ id: template.id }}>
            {t('messages.common.back')}
          </Link>
        </div>

        <section className="card form-card">
          <Form route="images.update" routeParams={{ id: template.id }} className="form">
            {({ errors }) => (
              <>
                <label>
                  {t('messages.common.name')}
                  <input type="text" name="name" defaultValue={template.name} required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                  {t('messages.common.description')}
                  <input type="text" name="description" defaultValue={template.description ?? ''} />
                </label>

                <label>
                  {t('messages.images.form.dockerfile')}
                  <textarea name="dockerfile" rows={14} defaultValue={template.dockerfile} />
                </label>

                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="isDefault"
                    value="1"
                    defaultChecked={template.isDefault}
                  />
                  {t('messages.images.form.defaultTemplate')}
                </label>

                <button type="submit" className="btn btn-primary">
                  {t('messages.common.save')}
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
