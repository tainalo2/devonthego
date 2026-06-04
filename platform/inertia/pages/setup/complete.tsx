type Props = {
  appUrl: string
}

export default function SetupComplete({ appUrl }: Props) {
  return (
    <div className="setup-page">
      <div className="setup-container">
        <section className="card">
          <h1>Configuration en cours</h1>
          <p>
            La plateforme redémarre en mode production avec certificats TLS. Cette opération prend
            environ 30 à 60 secondes.
          </p>
          <p>
            Reconnectez-vous ensuite sur :{' '}
            <a href={appUrl} className="btn btn-primary">
              {appUrl}
            </a>
          </p>
          <ul className="setup-checklist">
            <li>Utilisez l&apos;email et le mot de passe définis à l&apos;étape administrateur</li>
            <li>Le certificat Let&apos;s Encrypt peut prendre une minute supplémentaire</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
