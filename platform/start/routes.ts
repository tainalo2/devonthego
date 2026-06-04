/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import router from '@adonisjs/core/services/router'

router
  .get('/', async (ctx) => {
    if (ctx.auth.user) {
      return ctx.response.redirect().toRoute('dashboard.index')
    }
    return ctx.inertia.render('home', {})
  })
  .as('home')

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create'])
    router.post('signup', [controllers.NewAccount, 'store'])
    router.get('login', [controllers.Session, 'create'])
    router.post('login', [controllers.Session, 'store'])
  })
  .use(middleware.guest())

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy'])

    router.get('dashboard', [controllers.Dashboard, 'index']).as('dashboard.index')

    router.get('environments', [controllers.Environments, 'index']).as('environments.index')
    router
      .get('environments/create', [controllers.Environments, 'create'])
      .as('environments.create')
    router.post('environments', [controllers.Environments, 'store']).as('environments.store')
    router.get('environments/:id', [controllers.Environments, 'show']).as('environments.show')
    router
      .post('environments/:id/start', [controllers.Environments, 'start'])
      .use(middleware.canManageEnvironment())
      .as('environments.start')
    router
      .post('environments/:id/stop', [controllers.Environments, 'stop'])
      .use(middleware.canManageEnvironment())
      .as('environments.stop')
    router
      .post('environments/:id/regenerate-credentials', [
        controllers.Environments,
        'regenerateCredentials',
      ])
      .use(middleware.canManageEnvironment())
      .as('environments.regenerateCredentials')
    router
      .delete('environments/:id', [controllers.Environments, 'destroy'])
      .use(middleware.canManageEnvironment())
      .as('environments.destroy')

    router
      .group(() => {
        router.get('users', [controllers.Users, 'index']).as('users.index')
        router.get('users/create', [controllers.Users, 'create']).as('users.create')
        router.post('users', [controllers.Users, 'store']).as('users.store')
        router.get('users/:id/edit', [controllers.Users, 'edit']).as('users.edit')
        router.put('users/:id', [controllers.Users, 'update']).as('users.update')
        router.delete('users/:id', [controllers.Users, 'destroy']).as('users.destroy')

        router.get('images', [controllers.ImageTemplates, 'index']).as('images.index')
      })
      .use(middleware.admin())
  })
  .use(middleware.auth())
