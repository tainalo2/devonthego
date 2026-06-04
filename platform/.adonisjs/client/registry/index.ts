/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'setup.index': {
    methods: ["GET","HEAD"],
    pattern: '/setup',
    tokens: [{"old":"/setup","type":0,"val":"setup","end":""}],
    types: placeholder as Registry['setup.index']['types'],
  },
  'setup.store': {
    methods: ["POST"],
    pattern: '/setup',
    tokens: [{"old":"/setup","type":0,"val":"setup","end":""}],
    types: placeholder as Registry['setup.store']['types'],
  },
  'locale.update': {
    methods: ["POST"],
    pattern: '/locale',
    tokens: [{"old":"/locale","type":0,"val":"locale","end":""}],
    types: placeholder as Registry['locale.update']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'dashboard.index': {
    methods: ["GET","HEAD"],
    pattern: '/dashboard',
    tokens: [{"old":"/dashboard","type":0,"val":"dashboard","end":""}],
    types: placeholder as Registry['dashboard.index']['types'],
  },
  'environments.index': {
    methods: ["GET","HEAD"],
    pattern: '/environments',
    tokens: [{"old":"/environments","type":0,"val":"environments","end":""}],
    types: placeholder as Registry['environments.index']['types'],
  },
  'environments.create': {
    methods: ["GET","HEAD"],
    pattern: '/environments/create',
    tokens: [{"old":"/environments/create","type":0,"val":"environments","end":""},{"old":"/environments/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['environments.create']['types'],
  },
  'environments.store': {
    methods: ["POST"],
    pattern: '/environments',
    tokens: [{"old":"/environments","type":0,"val":"environments","end":""}],
    types: placeholder as Registry['environments.store']['types'],
  },
  'environments.show': {
    methods: ["GET","HEAD"],
    pattern: '/environments/:id',
    tokens: [{"old":"/environments/:id","type":0,"val":"environments","end":""},{"old":"/environments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['environments.show']['types'],
  },
  'environments.edit': {
    methods: ["GET","HEAD"],
    pattern: '/environments/:id/edit',
    tokens: [{"old":"/environments/:id/edit","type":0,"val":"environments","end":""},{"old":"/environments/:id/edit","type":1,"val":"id","end":""},{"old":"/environments/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['environments.edit']['types'],
  },
  'environments.update': {
    methods: ["PUT"],
    pattern: '/environments/:id',
    tokens: [{"old":"/environments/:id","type":0,"val":"environments","end":""},{"old":"/environments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['environments.update']['types'],
  },
  'environments.start': {
    methods: ["POST"],
    pattern: '/environments/:id/start',
    tokens: [{"old":"/environments/:id/start","type":0,"val":"environments","end":""},{"old":"/environments/:id/start","type":1,"val":"id","end":""},{"old":"/environments/:id/start","type":0,"val":"start","end":""}],
    types: placeholder as Registry['environments.start']['types'],
  },
  'environments.stop': {
    methods: ["POST"],
    pattern: '/environments/:id/stop',
    tokens: [{"old":"/environments/:id/stop","type":0,"val":"environments","end":""},{"old":"/environments/:id/stop","type":1,"val":"id","end":""},{"old":"/environments/:id/stop","type":0,"val":"stop","end":""}],
    types: placeholder as Registry['environments.stop']['types'],
  },
  'environments.regenerateCredentials': {
    methods: ["POST"],
    pattern: '/environments/:id/regenerate-credentials',
    tokens: [{"old":"/environments/:id/regenerate-credentials","type":0,"val":"environments","end":""},{"old":"/environments/:id/regenerate-credentials","type":1,"val":"id","end":""},{"old":"/environments/:id/regenerate-credentials","type":0,"val":"regenerate-credentials","end":""}],
    types: placeholder as Registry['environments.regenerateCredentials']['types'],
  },
  'environments.assignUsers': {
    methods: ["POST"],
    pattern: '/environments/:id/assign-users',
    tokens: [{"old":"/environments/:id/assign-users","type":0,"val":"environments","end":""},{"old":"/environments/:id/assign-users","type":1,"val":"id","end":""},{"old":"/environments/:id/assign-users","type":0,"val":"assign-users","end":""}],
    types: placeholder as Registry['environments.assignUsers']['types'],
  },
  'environments.destroy': {
    methods: ["DELETE"],
    pattern: '/environments/:id',
    tokens: [{"old":"/environments/:id","type":0,"val":"environments","end":""},{"old":"/environments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['environments.destroy']['types'],
  },
  'modules.search': {
    methods: ["GET","HEAD"],
    pattern: '/modules/search',
    tokens: [{"old":"/modules/search","type":0,"val":"modules","end":""},{"old":"/modules/search","type":0,"val":"search","end":""}],
    types: placeholder as Registry['modules.search']['types'],
  },
  'modules.curated': {
    methods: ["GET","HEAD"],
    pattern: '/modules/curated',
    tokens: [{"old":"/modules/curated","type":0,"val":"modules","end":""},{"old":"/modules/curated","type":0,"val":"curated","end":""}],
    types: placeholder as Registry['modules.curated']['types'],
  },
  'environments.modules.status': {
    methods: ["GET","HEAD"],
    pattern: '/environments/:id/modules/status',
    tokens: [{"old":"/environments/:id/modules/status","type":0,"val":"environments","end":""},{"old":"/environments/:id/modules/status","type":1,"val":"id","end":""},{"old":"/environments/:id/modules/status","type":0,"val":"modules","end":""},{"old":"/environments/:id/modules/status","type":0,"val":"status","end":""}],
    types: placeholder as Registry['environments.modules.status']['types'],
  },
  'environments.modules.store': {
    methods: ["POST"],
    pattern: '/environments/:id/modules',
    tokens: [{"old":"/environments/:id/modules","type":0,"val":"environments","end":""},{"old":"/environments/:id/modules","type":1,"val":"id","end":""},{"old":"/environments/:id/modules","type":0,"val":"modules","end":""}],
    types: placeholder as Registry['environments.modules.store']['types'],
  },
  'environments.modules.destroy': {
    methods: ["DELETE"],
    pattern: '/environments/:id/modules/:moduleId',
    tokens: [{"old":"/environments/:id/modules/:moduleId","type":0,"val":"environments","end":""},{"old":"/environments/:id/modules/:moduleId","type":1,"val":"id","end":""},{"old":"/environments/:id/modules/:moduleId","type":0,"val":"modules","end":""},{"old":"/environments/:id/modules/:moduleId","type":1,"val":"moduleId","end":""}],
    types: placeholder as Registry['environments.modules.destroy']['types'],
  },
  'users.index': {
    methods: ["GET","HEAD"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.index']['types'],
  },
  'users.create': {
    methods: ["GET","HEAD"],
    pattern: '/users/create',
    tokens: [{"old":"/users/create","type":0,"val":"users","end":""},{"old":"/users/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['users.create']['types'],
  },
  'users.store': {
    methods: ["POST"],
    pattern: '/users',
    tokens: [{"old":"/users","type":0,"val":"users","end":""}],
    types: placeholder as Registry['users.store']['types'],
  },
  'users.edit': {
    methods: ["GET","HEAD"],
    pattern: '/users/:id/edit',
    tokens: [{"old":"/users/:id/edit","type":0,"val":"users","end":""},{"old":"/users/:id/edit","type":1,"val":"id","end":""},{"old":"/users/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['users.edit']['types'],
  },
  'users.update': {
    methods: ["PUT"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.update']['types'],
  },
  'users.destroy': {
    methods: ["DELETE"],
    pattern: '/users/:id',
    tokens: [{"old":"/users/:id","type":0,"val":"users","end":""},{"old":"/users/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['users.destroy']['types'],
  },
  'images.index': {
    methods: ["GET","HEAD"],
    pattern: '/images',
    tokens: [{"old":"/images","type":0,"val":"images","end":""}],
    types: placeholder as Registry['images.index']['types'],
  },
  'images.create': {
    methods: ["GET","HEAD"],
    pattern: '/images/create',
    tokens: [{"old":"/images/create","type":0,"val":"images","end":""},{"old":"/images/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['images.create']['types'],
  },
  'images.store': {
    methods: ["POST"],
    pattern: '/images',
    tokens: [{"old":"/images","type":0,"val":"images","end":""}],
    types: placeholder as Registry['images.store']['types'],
  },
  'images.show': {
    methods: ["GET","HEAD"],
    pattern: '/images/:id',
    tokens: [{"old":"/images/:id","type":0,"val":"images","end":""},{"old":"/images/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['images.show']['types'],
  },
  'images.edit': {
    methods: ["GET","HEAD"],
    pattern: '/images/:id/edit',
    tokens: [{"old":"/images/:id/edit","type":0,"val":"images","end":""},{"old":"/images/:id/edit","type":1,"val":"id","end":""},{"old":"/images/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['images.edit']['types'],
  },
  'images.update': {
    methods: ["PUT"],
    pattern: '/images/:id',
    tokens: [{"old":"/images/:id","type":0,"val":"images","end":""},{"old":"/images/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['images.update']['types'],
  },
  'images.build': {
    methods: ["POST"],
    pattern: '/images/:id/build',
    tokens: [{"old":"/images/:id/build","type":0,"val":"images","end":""},{"old":"/images/:id/build","type":1,"val":"id","end":""},{"old":"/images/:id/build","type":0,"val":"build","end":""}],
    types: placeholder as Registry['images.build']['types'],
  },
  'images.buildStatus': {
    methods: ["GET","HEAD"],
    pattern: '/images/:id/build-status',
    tokens: [{"old":"/images/:id/build-status","type":0,"val":"images","end":""},{"old":"/images/:id/build-status","type":1,"val":"id","end":""},{"old":"/images/:id/build-status","type":0,"val":"build-status","end":""}],
    types: placeholder as Registry['images.buildStatus']['types'],
  },
  'images.destroy': {
    methods: ["DELETE"],
    pattern: '/images/:id',
    tokens: [{"old":"/images/:id","type":0,"val":"images","end":""},{"old":"/images/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['images.destroy']['types'],
  },
  'webhooks.index': {
    methods: ["GET","HEAD"],
    pattern: '/webhooks',
    tokens: [{"old":"/webhooks","type":0,"val":"webhooks","end":""}],
    types: placeholder as Registry['webhooks.index']['types'],
  },
  'webhooks.create': {
    methods: ["GET","HEAD"],
    pattern: '/webhooks/create',
    tokens: [{"old":"/webhooks/create","type":0,"val":"webhooks","end":""},{"old":"/webhooks/create","type":0,"val":"create","end":""}],
    types: placeholder as Registry['webhooks.create']['types'],
  },
  'webhooks.store': {
    methods: ["POST"],
    pattern: '/webhooks',
    tokens: [{"old":"/webhooks","type":0,"val":"webhooks","end":""}],
    types: placeholder as Registry['webhooks.store']['types'],
  },
  'webhooks.show': {
    methods: ["GET","HEAD"],
    pattern: '/webhooks/:id',
    tokens: [{"old":"/webhooks/:id","type":0,"val":"webhooks","end":""},{"old":"/webhooks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['webhooks.show']['types'],
  },
  'webhooks.edit': {
    methods: ["GET","HEAD"],
    pattern: '/webhooks/:id/edit',
    tokens: [{"old":"/webhooks/:id/edit","type":0,"val":"webhooks","end":""},{"old":"/webhooks/:id/edit","type":1,"val":"id","end":""},{"old":"/webhooks/:id/edit","type":0,"val":"edit","end":""}],
    types: placeholder as Registry['webhooks.edit']['types'],
  },
  'webhooks.update': {
    methods: ["PUT"],
    pattern: '/webhooks/:id',
    tokens: [{"old":"/webhooks/:id","type":0,"val":"webhooks","end":""},{"old":"/webhooks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['webhooks.update']['types'],
  },
  'webhooks.destroy': {
    methods: ["DELETE"],
    pattern: '/webhooks/:id',
    tokens: [{"old":"/webhooks/:id","type":0,"val":"webhooks","end":""},{"old":"/webhooks/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['webhooks.destroy']['types'],
  },
  'settings.index': {
    methods: ["GET","HEAD"],
    pattern: '/settings',
    tokens: [{"old":"/settings","type":0,"val":"settings","end":""}],
    types: placeholder as Registry['settings.index']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
