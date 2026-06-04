/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
    }
  }
  'setup.index': {
    methods: ["GET","HEAD"]
    pattern: '/setup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/setup_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/setup_controller').default['index']>>>
    }
  }
  'setup.store': {
    methods: ["POST"]
    pattern: '/setup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/setup').setupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/setup').setupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/setup_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/setup_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'dashboard.index': {
    methods: ["GET","HEAD"]
    pattern: '/dashboard'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/dashboard_controller').default['index']>>>
    }
  }
  'environments.index': {
    methods: ["GET","HEAD"]
    pattern: '/environments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['index']>>>
    }
  }
  'environments.create': {
    methods: ["GET","HEAD"]
    pattern: '/environments/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['create']>>>
    }
  }
  'environments.store': {
    methods: ["POST"]
    pattern: '/environments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/environment').createEnvironmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/environment').createEnvironmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'environments.show': {
    methods: ["GET","HEAD"]
    pattern: '/environments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['show']>>>
    }
  }
  'environments.edit': {
    methods: ["GET","HEAD"]
    pattern: '/environments/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['edit']>>>
    }
  }
  'environments.update': {
    methods: ["PUT"]
    pattern: '/environments/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/environment').updateEnvironmentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/environment').updateEnvironmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'environments.start': {
    methods: ["POST"]
    pattern: '/environments/:id/start'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['start']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['start']>>>
    }
  }
  'environments.stop': {
    methods: ["POST"]
    pattern: '/environments/:id/stop'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['stop']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['stop']>>>
    }
  }
  'environments.regenerateCredentials': {
    methods: ["POST"]
    pattern: '/environments/:id/regenerate-credentials'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['regenerateCredentials']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['regenerateCredentials']>>>
    }
  }
  'environments.assignUsers': {
    methods: ["POST"]
    pattern: '/environments/:id/assign-users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/environment').assignEnvironmentUsersValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/environment').assignEnvironmentUsersValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['assignUsers']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['assignUsers']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'environments.destroy': {
    methods: ["DELETE"]
    pattern: '/environments/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/environments_controller').default['destroy']>>>
    }
  }
  'users.index': {
    methods: ["GET","HEAD"]
    pattern: '/users'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['index']>>>
    }
  }
  'users.create': {
    methods: ["GET","HEAD"]
    pattern: '/users/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['create']>>>
    }
  }
  'users.store': {
    methods: ["POST"]
    pattern: '/users'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_user').createUserValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_user').createUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.edit': {
    methods: ["GET","HEAD"]
    pattern: '/users/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['edit']>>>
    }
  }
  'users.update': {
    methods: ["PUT"]
    pattern: '/users/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/admin_user').updateUserValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/admin_user').updateUserValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'users.destroy': {
    methods: ["DELETE"]
    pattern: '/users/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/users_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/users_controller').default['destroy']>>>
    }
  }
  'images.index': {
    methods: ["GET","HEAD"]
    pattern: '/images'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['index']>>>
    }
  }
  'images.create': {
    methods: ["GET","HEAD"]
    pattern: '/images/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['create']>>>
    }
  }
  'images.store': {
    methods: ["POST"]
    pattern: '/images'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/image_template').createImageTemplateValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/image_template').createImageTemplateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'images.show': {
    methods: ["GET","HEAD"]
    pattern: '/images/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['show']>>>
    }
  }
  'images.edit': {
    methods: ["GET","HEAD"]
    pattern: '/images/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['edit']>>>
    }
  }
  'images.update': {
    methods: ["PUT"]
    pattern: '/images/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/image_template').updateImageTemplateValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/image_template').updateImageTemplateValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'images.build': {
    methods: ["POST"]
    pattern: '/images/:id/build'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['build']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['build']>>>
    }
  }
  'images.buildStatus': {
    methods: ["GET","HEAD"]
    pattern: '/images/:id/build-status'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['buildStatus']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['buildStatus']>>>
    }
  }
  'images.destroy': {
    methods: ["DELETE"]
    pattern: '/images/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/image_templates_controller').default['destroy']>>>
    }
  }
  'webhooks.index': {
    methods: ["GET","HEAD"]
    pattern: '/webhooks'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['index']>>>
    }
  }
  'webhooks.create': {
    methods: ["GET","HEAD"]
    pattern: '/webhooks/create'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['create']>>>
    }
  }
  'webhooks.store': {
    methods: ["POST"]
    pattern: '/webhooks'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/webhook').createWebhookValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/webhook').createWebhookValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'webhooks.show': {
    methods: ["GET","HEAD"]
    pattern: '/webhooks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['show']>>>
    }
  }
  'webhooks.edit': {
    methods: ["GET","HEAD"]
    pattern: '/webhooks/:id/edit'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['edit']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['edit']>>>
    }
  }
  'webhooks.update': {
    methods: ["PUT"]
    pattern: '/webhooks/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/webhook').updateWebhookValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/webhook').updateWebhookValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'webhooks.destroy': {
    methods: ["DELETE"]
    pattern: '/webhooks/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/webhooks_controller').default['destroy']>>>
    }
  }
  'settings.index': {
    methods: ["GET","HEAD"]
    pattern: '/settings'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/settings_controller').default['index']>>>
    }
  }
}
