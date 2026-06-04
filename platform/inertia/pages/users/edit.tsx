import AppLayout from '~/layouts/app'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type User = {
  id: number
  email: string
  fullName: string | null
  role: 'admin' | 'user'
  isActive: boolean
}

type Props = {
  user: User
}

export default function UsersEdit({ user }: Props) {
  const { t, roleLabel } = useI18n()

  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>{t('messages.users.editTitle', { email: user.email })}</h1>
          <Link route="users.index">{t('messages.common.back')}</Link>
        </div>

        <section className="card form-card">
          <Form route="users.update" routeParams={{ id: user.id }} className="form">
            {({ errors }) => (
              <>
                <label>
                  {t('messages.users.form.fullName')}
                  <input type="text" name="fullName" defaultValue={user.fullName ?? ''} />
                </label>
                <label>
                  {t('messages.common.email')}
                  <input type="email" name="email" defaultValue={user.email} required />
                  {errors.email && <span className="error">{errors.email}</span>}
                </label>
                <label>
                  {t('messages.users.form.newPassword')}
                  <input type="password" name="password" />
                </label>
                <label>
                  {t('messages.users.form.role')}
                  <select name="role" defaultValue={user.role}>
                    <option value="user">{roleLabel('user')}</option>
                    <option value="admin">{roleLabel('admin')}</option>
                  </select>
                </label>
                <label className="checkbox">
                  <input
                    type="checkbox"
                    name="isActive"
                    value="1"
                    defaultChecked={user.isActive}
                  />
                  {t('messages.users.form.activeAccount')}
                </label>
                <button type="submit" className="btn btn-primary">
                  {t('messages.common.save')}
                </button>
              </>
            )}
          </Form>

          <Form route="users.destroy" routeParams={{ id: user.id }} className="danger-zone">
            <button type="submit" className="btn btn-danger">
              {t('messages.users.form.deleteUser')}
            </button>
          </Form>
        </section>
      </div>
    </AppLayout>
  )
}
