import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Link } from '@adonisjs/inertia/react'
import LanguageSwitcher from '~/components/language_switcher'
import { useI18n } from '~/hooks/use_i18n'

export default function PublicLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url } = usePage()
  const { t } = useI18n()

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
              {t('messages.app.name')}
            </Link>
          </div>
          <div>
            <nav>
              <LanguageSwitcher />
              <Link route="session.create">{t('messages.nav.login')}</Link>
              <Link route="new_account.create">{t('messages.nav.signup')}</Link>
            </nav>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <Toaster position="top-center" richColors />
    </>
  )
}
