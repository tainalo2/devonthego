import AppLayout from '~/layouts/app'

type Settings = {
  domain: string
  dockerNetwork: string
  dockerRegistry: string
  workspacePath: string
  defaultCpuLimit: number
  defaultMemoryLimit: string
  allowPublicSignup: boolean
  dbConnection: string
  appUrl: string
}

type Props = {
  settings: Settings
}

export default function SettingsIndex({ settings }: Props) {
  return (
    <AppLayout>
      <div className="page">
        <div className="page-header">
          <h1>Paramètres plateforme</h1>
        </div>

        <section className="card">
          <p className="muted">
            Configuration lue depuis les variables d&apos;environnement. Modifiez le fichier{' '}
            <code>.env</code> et redémarrez la plateforme pour appliquer les changements.
          </p>

          <dl className="detail-list settings-list">
            <div>
              <dt>Domaine</dt>
              <dd>{settings.domain}</dd>
            </div>
            <div>
              <dt>URL admin</dt>
              <dd>{settings.appUrl}</dd>
            </div>
            <div>
              <dt>Réseau Docker</dt>
              <dd>{settings.dockerNetwork}</dd>
            </div>
            <div>
              <dt>Registry local</dt>
              <dd>{settings.dockerRegistry}</dd>
            </div>
            <div>
              <dt>Chemin workspaces</dt>
              <dd>{settings.workspacePath}</dd>
            </div>
            <div>
              <dt>CPU par défaut</dt>
              <dd>{settings.defaultCpuLimit} core(s)</dd>
            </div>
            <div>
              <dt>RAM par défaut</dt>
              <dd>{settings.defaultMemoryLimit}</dd>
            </div>
            <div>
              <dt>Base de données</dt>
              <dd>{settings.dbConnection}</dd>
            </div>
            <div>
              <dt>Inscription publique</dt>
              <dd>{settings.allowPublicSignup ? 'Activée' : 'Désactivée'}</dd>
            </div>
          </dl>
        </section>

        <section className="card">
          <h2>Maintenance</h2>
          <p className="muted">
            Commande cron recommandée pour synchroniser les statuts Docker :
          </p>
          <pre className="docker-logs">node ace dotg:sync-environments</pre>
        </section>
      </div>
    </AppLayout>
  )
}
