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
  'environments.destroy': {
    methods: ["DELETE"],
    pattern: '/environments/:id',
    tokens: [{"old":"/environments/:id","type":0,"val":"environments","end":""},{"old":"/environments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['environments.destroy']['types'],
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
