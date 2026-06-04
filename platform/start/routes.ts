/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
*/

import { middleware } from '#start/kernel'
import { controllers } from '#generated/controllers'
import SetupService from '#services/setup_service'
import router from '@adonisjs/core/services/router'

router
  .get('/', async (ctx) => {
    if (!(await SetupService.isCompleted())) {
      if (ctx.auth.user) {
        return ctx.response.redirect().toRoute('setup.index')
      }
      return ctx.response.redirect().toRoute('session.create')
    }

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

router.post('locale', [controllers.Locale, 'update']).as('locale.update')

router
  .group(() => {
    router.get('setup', [controllers.Setup, 'index']).as('setup.index')
    router.post('setup', [controllers.Setup, 'store']).as('setup.store')
  })
  .use(middleware.auth())

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
      .get('environments/:id/edit', [controllers.Environments, 'edit'])
      .use(middleware.canManageEnvironment())
      .as('environments.edit')
    router
      .put('environments/:id', [controllers.Environments, 'update'])
      .use(middleware.canManageEnvironment())
      .as('environments.update')
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
      .post('environments/:id/assign-users', [controllers.Environments, 'assignUsers'])
      .use(middleware.canManageEnvironment())
      .as('environments.assignUsers')
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
        router.get('images/create', [controllers.ImageTemplates, 'create']).as('images.create')
        router.post('images', [controllers.ImageTemplates, 'store']).as('images.store')
        router.get('images/:id', [controllers.ImageTemplates, 'show']).as('images.show')
        router.get('images/:id/edit', [controllers.ImageTemplates, 'edit']).as('images.edit')
        router.put('images/:id', [controllers.ImageTemplates, 'update']).as('images.update')
        router.post('images/:id/build', [controllers.ImageTemplates, 'build']).as('images.build')
        router
          .get('images/:id/build-status', [controllers.ImageTemplates, 'buildStatus'])
          .as('images.buildStatus')
        router.delete('images/:id', [controllers.ImageTemplates, 'destroy']).as('images.destroy')

        router.get('webhooks', [controllers.Webhooks, 'index']).as('webhooks.index')
        router.get('webhooks/create', [controllers.Webhooks, 'create']).as('webhooks.create')
        router.post('webhooks', [controllers.Webhooks, 'store']).as('webhooks.store')
        router.get('webhooks/:id', [controllers.Webhooks, 'show']).as('webhooks.show')
        router.get('webhooks/:id/edit', [controllers.Webhooks, 'edit']).as('webhooks.edit')
        router.put('webhooks/:id', [controllers.Webhooks, 'update']).as('webhooks.update')
        router.delete('webhooks/:id', [controllers.Webhooks, 'destroy']).as('webhooks.destroy')

        router.get('settings', [controllers.Settings, 'index']).as('settings.index')
      })
      .use(middleware.admin())
  })
  .use(middleware.auth())
