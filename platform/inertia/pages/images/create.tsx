import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type Props = {
  defaultDockerfile: string
}

export default function ImagesCreate({ defaultDockerfile }: Props) {
  const { t } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.images.createTitle')}</h1>
          <Link route="images.index">{t('messages.common.back')}</Link>
        </div>

        <section className="card form-card">
          <Form route="images.store" className="form">
            {({ errors }) => (
              <>
                <label>
                  {t('messages.common.name')}
                  <input type="text" name="name" required />
                  {errors.name && <span className="error">{errors.name}</span>}
                </label>

                <label>
                  {t('messages.common.description')}
                  <input type="text" name="description" />
                </label>

                <label>
                  {t('messages.images.form.dockerfile')}
                  <textarea name="dockerfile" rows={12} defaultValue={defaultDockerfile} />
                  {errors.dockerfile && <span className="error">{errors.dockerfile}</span>}
                </label>

                <label className="checkbox">
                  <input type="checkbox" name="isDefault" value="1" />
                  {t('messages.images.form.defaultTemplate')}
                </label>

                <button type="submit" className="btn btn-primary">
                  {t('messages.images.form.submitCreate')}
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
