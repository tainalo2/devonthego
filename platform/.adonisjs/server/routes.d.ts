import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'environments.index': { paramsTuple?: []; params?: {} }
    'environments.create': { paramsTuple?: []; params?: {} }
    'environments.store': { paramsTuple?: []; params?: {} }
    'environments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.start': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.stop': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.regenerateCredentials': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.assignUsers': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.store': { paramsTuple?: []; params?: {} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.index': { paramsTuple?: []; params?: {} }
    'images.create': { paramsTuple?: []; params?: {} }
    'images.store': { paramsTuple?: []; params?: {} }
    'images.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.build': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.buildStatus': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.index': { paramsTuple?: []; params?: {} }
    'webhooks.create': { paramsTuple?: []; params?: {} }
    'webhooks.store': { paramsTuple?: []; params?: {} }
    'webhooks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'environments.index': { paramsTuple?: []; params?: {} }
    'environments.create': { paramsTuple?: []; params?: {} }
    'environments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.index': { paramsTuple?: []; params?: {} }
    'images.create': { paramsTuple?: []; params?: {} }
    'images.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.buildStatus': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.index': { paramsTuple?: []; params?: {} }
    'webhooks.create': { paramsTuple?: []; params?: {} }
    'webhooks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'dashboard.index': { paramsTuple?: []; params?: {} }
    'environments.index': { paramsTuple?: []; params?: {} }
    'environments.create': { paramsTuple?: []; params?: {} }
    'environments.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.index': { paramsTuple?: []; params?: {} }
    'users.create': { paramsTuple?: []; params?: {} }
    'users.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.index': { paramsTuple?: []; params?: {} }
    'images.create': { paramsTuple?: []; params?: {} }
    'images.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.buildStatus': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.index': { paramsTuple?: []; params?: {} }
    'webhooks.create': { paramsTuple?: []; params?: {} }
    'webhooks.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.edit': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'settings.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'environments.store': { paramsTuple?: []; params?: {} }
    'environments.start': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.stop': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.regenerateCredentials': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'environments.assignUsers': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.store': { paramsTuple?: []; params?: {} }
    'images.store': { paramsTuple?: []; params?: {} }
    'images.build': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'environments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'environments.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'users.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'images.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'webhooks.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}