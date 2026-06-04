import { type Data } from '@generated/data'
import { toast, Toaster } from 'sonner'
import { usePage } from '@inertiajs/react'
import { type ReactElement, useEffect } from 'react'
import { Form, Link } from '@adonisjs/inertia/react'
import LanguageSwitcher from '~/components/language_switcher'
import { useI18n } from '~/hooks/use_i18n'

export default function AppLayout({ children }: { children: ReactElement<Data.SharedProps> }) {
  const { url, props } = usePage<Data.SharedProps>()
  const { t } = useI18n()
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
              {t('messages.app.name')}
            </Link>
          </div>
          <div>
            <nav>
              {user ? (
                <>
                  {navLink('/dashboard', t('messages.nav.dashboard'))}
                  {navLink('/environments', t('messages.nav.environments'))}
                  {user.role === 'admin' && (
                    <>
                      {navLink('/users', t('messages.nav.users'))}
                      {navLink('/images', t('messages.nav.images'))}
                      {navLink('/webhooks', t('messages.nav.webhooks'))}
                      {navLink('/settings', t('messages.nav.settings'))}
                    </>
                  )}
                  <LanguageSwitcher />
                  <span className="user-badge">{user.initials}</span>
                  <Form route="session.destroy">
                    <button type="submit">{t('messages.nav.logout')}</button>
                  </Form>
                </>
              ) : (
                <>
                  <LanguageSwitcher />
                  <Link route="new_account.create">{t('messages.nav.signup')}</Link>
                  <Link route="session.create">{t('messages.nav.login')}</Link>
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
