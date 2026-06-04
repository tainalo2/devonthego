import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'

export default function AppLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url, props } = usePage<Data.SharedProps>()
  const user = props.user

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash.error) {
      toast.error(children.props.flash.error)
    }
    if (children.props.flash.success) {
      toast.success(children.props.flash.success)
    }
  })

  const navLink = (href: string, label: string) => (
    <Link href={href} className={url.startsWith(href) ? 'current' : undefined}>
      {label}
    </Link>
  )

  return (
    <>
      <header>
        <div>
          <div>
            <Link route="dashboard.index" className="brand">
              Dev on the go
            </Link>
          </div>
          <div>
            <nav>
              {user ? (
                <>
                  {navLink('/dashboard', 'Tableau de bord')}
                  {navLink('/environments', 'Environnements')}
                  {user.role === 'admin' && (
                    <>
                      {navLink('/users', 'Utilisateurs')}
                      {navLink('/images', 'Images')}
                      {navLink('/settings', 'Paramètres')}
                    </>
                  )}
                  <span className="user-badge">{user.initials}</span>
                  <Form route="session.destroy">
                    <button type="submit">Déconnexion</button>
                  </Form>
                </>
              ) : (
                <>
                  <Link route="new_account.create">Inscription</Link>
                  <Link route="session.create">Connexion</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Toaster position="top-center" richColors />
    </>
  )
}
