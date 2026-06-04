import PublicLayout from '~/layouts/public'

export default function Home() {
  return (
    <PublicLayout>
      <div className="hero">
        <h1>Dev on the go</h1>
        <p>
          Environnements de développement contenairisés avec VS Code dans le navigateur. Déployez,
          codez et collaborez depuis n&apos;importe où.
        </p>
        <div className="hero-actions">
          <a href="/login" className="btn btn-primary">
            Se connecter
          </a>
          <a href="/signup" className="btn">
            Créer un compte
          </a>
        </div>
      </div>
    </PublicLayout>
  )
}
