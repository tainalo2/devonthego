import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Link } from '@adonisjs/inertia/react'

export default function PublicLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()

  useEffect(() => {
    toast.dismiss()
  }, [url])

  useEffect(() => {
    if (children.props.flash?.error) toast.error(children.props.flash.error)
    if (children.props.flash?.success) toast.success(children.props.flash.success)
  })

  return (
    <>
      <header>
        <div>
          <div>
            <Link route="home" className="brand">
              Dev on the go
            </Link>
          </div>
          <div>
            <nav>
              <Link route="session.create">Connexion</Link>
              <Link route="new_account.create">Inscription</Link>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Toaster position="top-center" richColors />
    </>
  )
}
