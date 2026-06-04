import PublicLayout from '~/layouts/public'
import { Form, Link } from '@adonisjs/inertia/react'
import { useI18n } from '~/hooks/use_i18n'

export default function Signup() {
  const { t } = useI18n()

  return (
    <PublicLayout>
      <div className="form-container">
        <div>
          <h1>{t('messages.auth.signup.title')}</h1>
          <p>{t('messages.auth.signup.subtitle')}</p>
        </div>

        <Form route="new_account.store">
          {({ errors }) => (
            <>
              <div>
                <label htmlFor="fullName">{t('messages.auth.signup.fullName')}</label>
                <input type="text" name="fullName" id="fullName" />
                {errors.fullName && <div>{errors.fullName}</div>}
              </div>

              <div>
                <label htmlFor="email">{t('messages.common.email')}</label>
                <input type="email" name="email" id="email" autoComplete="email" />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div>
                <label htmlFor="password">{t('messages.common.password')}</label>
                <input type="password" name="password" id="password" autoComplete="new-password" />
                {errors.password && <div>{errors.password}</div>}
              </div>

              <div>
                <label htmlFor="passwordConfirmation">{t('messages.auth.signup.passwordConfirm')}</label>
                <input
                  type="password"
                  name="passwordConfirmation"
                  id="passwordConfirmation"
                  autoComplete="new-password"
                />
                {errors.passwordConfirmation && <div>{errors.passwordConfirmation}</div>}
              </div>

              <div>
                <button type="submit" className="btn btn-primary">
                  {t('messages.auth.signup.submit')}
                </button>
              </div>
              <p>
                {t('messages.auth.signup.hasAccount')}{' '}
                <Link route="session.create">{t('messages.auth.signup.loginLink')}</Link>
              </p>
            </>
          )}
        </Form>
      </div>
    </PublicLayout>
  )
}
