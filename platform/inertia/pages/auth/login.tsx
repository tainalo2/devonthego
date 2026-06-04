import PublicLayout from '~/layouts/public'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

type Props = {
  bootstrapMode?: boolean
}

export default function Login({ bootstrapMode = false }: Props) {
  const { t } = useI18n()

  return (
    <PublicLayout>
      <div className="form-container">
        <div>
          <h1>{t('messages.auth.login.title')}</h1>
          <p>{t('messages.auth.login.subtitle')}</p>
          {bootstrapMode && (
            <>
              <p className="muted">{t('messages.auth.login.bootstrapHint')}</p>
              <p className="muted">{t('messages.auth.login.tlsHint')}</p>
            </>
          )}
        </div>

        <Form route="session.store">
          {({ errors }) => (
            <>
              <div>
                <label htmlFor="email">{t('messages.common.email')}</label>
                <input type="email" name="email" id="email" autoComplete="username" />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">{t('messages.common.password')}</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="current-password"
                />
                {errors.password && <span>{errors.password}</span>}
              </div>

              <div>
                <button type="submit" className="btn btn-primary">
                  {t('messages.auth.login.submit')}
                </button>
              </div>
              <p>
                {t('messages.auth.login.noAccount')}{' '}
                <Link route="new_account.create">{t('messages.auth.login.signupLink')}</Link>
              </p>
            </>
          )}
        </Form>
      </div>
    </PublicLayout>
  )
}
