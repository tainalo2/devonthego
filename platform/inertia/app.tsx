import './css/app.css'
import { type ReactElement } from 'react'
import { client } from './client'
import { type Data } from '@generated/data'
import { createRoot } from 'react-dom/client'
import { createInertiaApp } from '@inertiajs/react'
import { TuyauProvider } from '@adonisjs/inertia/react'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'

const defaultAppName = 'Dev on the go'
let appName = defaultAppName

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) => {
    return resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob('./pages/**/*.tsx'),
      (page: ReactElement<Data.SharedProps>) => page
    )
  },
  setup({ el, App, props }) {
    const translations = (props.initialPage.props as { translations?: Record<string, string> })
      .translations
    appName = translations?.['messages.app.name'] ?? defaultAppName

    createRoot(el).render(
      <TuyauProvider client={client}>
        <App {...props} />
      </TuyauProvider>
    )
  },
  progress: {
    color: '#4B5563',
  },
})
