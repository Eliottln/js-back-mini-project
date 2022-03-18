'use strict'

import tasks from "./tasks/index.js"

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return { root: true }
  })
  fastify.register(tasks, {prefix: 'tasks'})
}
