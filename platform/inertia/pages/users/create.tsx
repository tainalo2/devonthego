import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

export default function UsersCreate() {
  const { t, roleLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.users.createTitle')}</h1>
          <Link route="users.index">{t('messages.common.back')}</Link>
        </div>

        <section className="card form-card">
          <Form route="users.store" className="form">
            {({ errors }) => (
              <>
                <label>
                  {t('messages.users.form.fullName')}
                  <input type="text" name="fullName" />
                </label>
                <label>
                  {t('messages.common.email')}
                  <input type="email" name="email" required />
                  {errors.email && <span className="error">{errors.email}</span>}
                </label>
                <label>
                  {t('messages.users.form.password')}
                  <input type="password" name="password" required />
                  {errors.password && <span className="error">{errors.password}</span>}
                </label>
                <label>
                  {t('messages.users.form.role')}
                  <select name="role" defaultValue="user">
                    <option value="user">{roleLabel('user')}</option>
                    <option value="admin">{roleLabel('admin')}</option>
                  </select>
                </label>
                <label className="checkbox">
                  <input type="checkbox" name="isActive" value="1" defaultChecked />
                  {t('messages.users.form.activeAccount')}
                </label>
                <button type="submit" className="btn btn-primary">
                  {t('messages.common.create')}
                </button>
              </>
            )}
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
