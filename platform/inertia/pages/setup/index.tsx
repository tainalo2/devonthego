import { Form } from '@adonisjs/inertia/react'
import { useState } from 'react'

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

const STEPS = ['Domaine & TLS', 'Administrateur', 'Ressources', 'Confirmation']

export default function SetupIndex({ defaults, bootstrapUrl }: Props) {
  const [step, setStep] = useState(0)

  return (
    <div className="setup-page">
      <div className="setup-container">
        <header className="setup-header">
          <h1>Configuration initiale</h1>
          <p className="muted">
            Bienvenue sur Dev on the go. Complétez cette configuration pour activer HTTPS et
            déployer la plateforme en production.
          </p>
          <p className="muted">
            Accès actuel (bootstrap) : <code>{bootstrapUrl}</code>
          </p>
        </header>

        <nav className="setup-steps" aria-label="Étapes">
          {STEPS.map((label, index) => (
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
                <h2>Domaine &amp; certificats TLS</h2>
                <p className="muted">
                  Le domaine doit pointer vers ce serveur (enregistrement DNS A). Les certificats
                  Let&apos;s Encrypt seront générés automatiquement.
                </p>
                <div>
                  <label htmlFor="domain">Domaine principal</label>
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
                  <label htmlFor="acmeEmail">Email Let&apos;s Encrypt</label>
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
                  URL admin après configuration : <code>https://admin.&lt;domaine&gt;</code>
                </p>
              </section>

              <section className={`card setup-panel ${step === 1 ? '' : 'hidden'}`}>
                <h2>Compte administrateur</h2>
                <p className="muted">
                  Remplace les identifiants bootstrap temporaires par votre compte définitif.
                </p>
                <div>
                  <label htmlFor="adminEmail">Email</label>
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
                  <label htmlFor="adminFullName">Nom complet</label>
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
                  <label htmlFor="adminPassword">Mot de passe</label>
                  <input type="password" name="adminPassword" id="adminPassword" required />
                  {errors.adminPassword && <div className="field-error">{errors.adminPassword}</div>}
                </div>
                <div>
                  <label htmlFor="adminPasswordConfirmation">Confirmer le mot de passe</label>
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
                    Autoriser l&apos;inscription publique
                  </label>
                </div>
              </section>

              <section className={`card setup-panel ${step === 2 ? '' : 'hidden'}`}>
                <h2>Limites par environnement</h2>
                <div>
                  <label htmlFor="envCpuLimit">CPU (cores)</label>
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
                  <label htmlFor="envMemoryLimit">Mémoire (ex: 1024m, 2g)</label>
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
                <h2>Confirmation</h2>
                <p>
                  La plateforme va écrire la configuration, recréer Traefik avec HTTPS et redémarrer.
                  Cette opération prend environ 30 secondes.
                </p>
                <ul className="setup-checklist">
                  <li>Vérifiez que le DNS pointe vers ce serveur</li>
                  <li>Les ports 80 et 443 doivent être ouverts</li>
                  <li>Vous serez déconnecté et devrez vous reconnecter sur la nouvelle URL</li>
                </ul>
              </section>

              <div className="setup-actions">
                {step > 0 && (
                  <button type="button" className="btn" onClick={() => setStep((s) => s - 1)}>
                    Précédent
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Suivant
                  </button>
                ) : (
                  <button type="submit" className="btn btn-primary" disabled={processing}>
                    {processing ? 'Déploiement en cours…' : 'Déployer la plateforme'}
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
