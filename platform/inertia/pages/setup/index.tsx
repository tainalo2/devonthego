import { Form } from '@adonisjs/inertia/react'
import { useState } from 'react'
import { useI18n } from '~/hooks/use_i18n'

type Defaults = {
  domain: string
  acmeEmail: string
  adminEmail: string
  adminFullName: string
  allowPublicSignup: boolean
  envCpuLimit: number
  envMemoryLimit: string
}

type Props = {
  defaults: Defaults
  bootstrapUrl: string
}

export default function SetupIndex({ defaults, bootstrapUrl }: Props) {
  const { t } = useI18n()
  const [step, setStep] = useState(0)

  const steps = [
    t('messages.setup.steps.domain'),
    t('messages.setup.steps.admin'),
    t('messages.setup.steps.resources'),
    t('messages.setup.steps.confirm'),
  ]

  return (
    <div className="setup-page">
      <div className="setup-container">
        <header className="setup-header">
          <h1>{t('messages.setup.title')}</h1>
          <p className="muted">{t('messages.setup.welcome')}</p>
          <p className="muted">
            {t('messages.setup.bootstrapAccess')} <code>{bootstrapUrl}</code>
          </p>
          <p className="muted">{t('messages.setup.certHint')}</p>
        </header>

        <nav className="setup-steps" aria-label={t('messages.setup.stepsLabel')}>
          {steps.map((label, index) => (
            <span
              key={label}
              className={`setup-step ${index === step ? 'active' : ''} ${index < step ? 'done' : ''}`}
            >
              {index + 1}. {label}
            </span>
          ))}
        </nav>

        <Form route="setup.store" className="setup-form">
          {({ errors, processing }) => (
            <>
              <section className={`card setup-panel ${step === 0 ? '' : 'hidden'}`}>
                <h2>{t('messages.setup.domain.title')}</h2>
                <p className="muted">{t('messages.setup.domain.hint')}</p>
                <div>
                  <label htmlFor="domain">{t('messages.setup.domain.primaryDomain')}</label>
                  <input
                    type="text"
                    name="domain"
                    id="domain"
                    defaultValue={defaults.domain}
                    placeholder="dev.example.com"
                    required
                  />
                  {errors.domain && <div className="field-error">{errors.domain}</div>}
                </div>
                <div>
                  <label htmlFor="acmeEmail">{t('messages.setup.domain.acmeEmail')}</label>
                  <input
                    type="email"
                    name="acmeEmail"
                    id="acmeEmail"
                    defaultValue={defaults.acmeEmail}
                    placeholder="admin@example.com"
                    required
                  />
                  {errors.acmeEmail && <div className="field-error">{errors.acmeEmail}</div>}
                </div>
                <p className="muted">
                  {t('messages.setup.domain.adminUrlHint')}{' '}
                  <code>https://admin.&lt;domain&gt;</code>
                </p>
              </section>

              <section className={`card setup-panel ${step === 1 ? '' : 'hidden'}`}>
                <h2>{t('messages.setup.admin.title')}</h2>
                <p className="muted">{t('messages.setup.admin.hint')}</p>
                <div>
                  <label htmlFor="adminEmail">{t('messages.common.email')}</label>
                  <input
                    type="email"
                    name="adminEmail"
                    id="adminEmail"
                    defaultValue={defaults.adminEmail}
                    required
                  />
                  {errors.adminEmail && <div className="field-error">{errors.adminEmail}</div>}
                </div>
                <div>
                  <label htmlFor="adminFullName">{t('messages.auth.signup.fullName')}</label>
                  <input
                    type="text"
                    name="adminFullName"
                    id="adminFullName"
                    defaultValue={defaults.adminFullName}
                    required
                  />
                  {errors.adminFullName && <div className="field-error">{errors.adminFullName}</div>}
                </div>
                <div>
                  <label htmlFor="adminPassword">{t('messages.common.password')}</label>
                  <input type="password" name="adminPassword" id="adminPassword" required />
                  {errors.adminPassword && <div className="field-error">{errors.adminPassword}</div>}
                </div>
                <div>
                  <label htmlFor="adminPasswordConfirmation">
                    {t('messages.auth.signup.passwordConfirm')}
                  </label>
                  <input
                    type="password"
                    name="adminPasswordConfirmation"
                    id="adminPasswordConfirmation"
                    required
                  />
                  {errors.adminPasswordConfirmation && (
                    <div className="field-error">{errors.adminPasswordConfirmation}</div>
                  )}
                </div>
                <div className="checkbox-row">
                  <input type="hidden" name="allowPublicSignup" value="0" />
                  <label>
                    <input
                      type="checkbox"
                      name="allowPublicSignup"
                      defaultChecked={defaults.allowPublicSignup}
                      value="1"
                    />
                    {t('messages.setup.admin.allowPublicSignup')}
                  </label>
                </div>
              </section>

              <section className={`card setup-panel ${step === 2 ? '' : 'hidden'}`}>
                <h2>{t('messages.setup.resources.title')}</h2>
                <div>
                  <label htmlFor="envCpuLimit">{t('messages.setup.resources.cpu')}</label>
                  <input
                    type="number"
                    name="envCpuLimit"
                    id="envCpuLimit"
                    step="0.25"
                    min="0.25"
                    defaultValue={defaults.envCpuLimit}
                    required
                  />
                  {errors.envCpuLimit && <div className="field-error">{errors.envCpuLimit}</div>}
                </div>
                <div>
                  <label htmlFor="envMemoryLimit">{t('messages.setup.resources.memory')}</label>
                  <input
                    type="text"
                    name="envMemoryLimit"
                    id="envMemoryLimit"
                    defaultValue={defaults.envMemoryLimit}
                    required
                  />
                  {errors.envMemoryLimit && (
                    <div className="field-error">{errors.envMemoryLimit}</div>
                  )}
                </div>
              </section>

              <section className={`card setup-panel ${step === 3 ? '' : 'hidden'}`}>
                <h2>{t('messages.setup.confirm.title')}</h2>
                <p>{t('messages.setup.confirm.description')}</p>
                <ul className="setup-checklist">
                  <li>{t('messages.setup.confirm.checkDns')}</li>
                  <li>{t('messages.setup.confirm.checkPorts')}</li>
                  <li>{t('messages.setup.confirm.checkLogout')}</li>
                </ul>
              </section>

              <div className="setup-actions">
                {step > 0 && (
                  <button type="button" className="btn" onClick={() => setStep((s) => s - 1)}>
                    {t('messages.common.previous')}
                  </button>
                )}
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep((s) => s + 1)}
                  >
                    {t('messages.common.next')}
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={processing}>
                    {processing ? t('messages.setup.deploying') : t('messages.setup.deploy')}
                  </button>
                )}
              </div>
            </>
          )}
        </Form>
      </div>
    </div>
  )
}
