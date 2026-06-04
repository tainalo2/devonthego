/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  setup: {
    index: typeof routes['setup.index']
    store: typeof routes['setup.store']
  }
  dashboard: {
    index: typeof routes['dashboard.index']
  }
  environments: {
    index: typeof routes['environments.index']
    create: typeof routes['environments.create']
    store: typeof routes['environments.store']
    show: typeof routes['environments.show']
    edit: typeof routes['environments.edit']
    update: typeof routes['environments.update']
    start: typeof routes['environments.start']
    stop: typeof routes['environments.stop']
    regenerateCredentials: typeof routes['environments.regenerateCredentials']
    assignUsers: typeof routes['environments.assignUsers']
    destroy: typeof routes['environments.destroy']
  }
  users: {
    index: typeof routes['users.index']
    create: typeof routes['users.create']
    store: typeof routes['users.store']
    edit: typeof routes['users.edit']
    update: typeof routes['users.update']
    destroy: typeof routes['users.destroy']
  }
  images: {
    index: typeof routes['images.index']
    create: typeof routes['images.create']
    store: typeof routes['images.store']
    show: typeof routes['images.show']
    edit: typeof routes['images.edit']
    update: typeof routes['images.update']
    build: typeof routes['images.build']
    buildStatus: typeof routes['images.buildStatus']
    destroy: typeof routes['images.destroy']
  }
  webhooks: {
    index: typeof routes['webhooks.index']
    create: typeof routes['webhooks.create']
    store: typeof routes['webhooks.store']
    show: typeof routes['webhooks.show']
    edit: typeof routes['webhooks.edit']
    update: typeof routes['webhooks.update']
    destroy: typeof routes['webhooks.destroy']
  }
  settings: {
    index: typeof routes['settings.index']
  }
}
