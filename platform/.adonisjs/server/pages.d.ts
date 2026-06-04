import '@adonisjs/inertia/types'

import type React from 'react'
import type { Prettify } from '@adonisjs/core/types/common'

type ExtractProps<T> =
  T extends React.FC<infer Props>
    ? Prettify<Omit<Props, 'children'>>
    : T extends React.Component<infer Props>
      ? Prettify<Omit<Props, 'children'>>
      : never

declare module '@adonisjs/inertia/types' {
  export interface InertiaPages {
    'auth/login': ExtractProps<(typeof import('../../inertia/pages/auth/login.tsx'))['default']>
    'auth/signup': ExtractProps<(typeof import('../../inertia/pages/auth/signup.tsx'))['default']>
    'dashboard/index': ExtractProps<(typeof import('../../inertia/pages/dashboard/index.tsx'))['default']>
    'environments/create': ExtractProps<(typeof import('../../inertia/pages/environments/create.tsx'))['default']>
    'environments/index': ExtractProps<(typeof import('../../inertia/pages/environments/index.tsx'))['default']>
    'environments/show': ExtractProps<(typeof import('../../inertia/pages/environments/show.tsx'))['default']>
    'errors/not_found': ExtractProps<(typeof import('../../inertia/pages/errors/not_found.tsx'))['default']>
    'errors/server_error': ExtractProps<(typeof import('../../inertia/pages/errors/server_error.tsx'))['default']>
    'home': ExtractProps<(typeof import('../../inertia/pages/home.tsx'))['default']>
    'images/index': ExtractProps<(typeof import('../../inertia/pages/images/index.tsx'))['default']>
    'users/create': ExtractProps<(typeof import('../../inertia/pages/users/create.tsx'))['default']>
    'users/edit': ExtractProps<(typeof import('../../inertia/pages/users/edit.tsx'))['default']>
    'users/index': ExtractProps<(typeof import('../../inertia/pages/users/index.tsx'))['default']>
  }
}
