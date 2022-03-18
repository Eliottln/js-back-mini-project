'use strict'

import { Op } from "sequelize";
import { Task } from "../../database.js"

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    if (request.query.name)
      return await Task.findAll({
        where: {
          name: { [Op.substring]: request.query.name }
        }
      })
    return await Task.findAll();
  })
  fastify.get('/stats', async function (request, reply) {
    const tasks = await Task.findAll();
    const total = tasks.length;
    const done = tasks.filter(task => task.state).length;
    const avg = this.total > 0 ? this.done / this.total * 100 : 0;
    return {
      done,
      total,
      avg,
    }
  })
  fastify.get('/:id', async function (request, reply) {
    return await Task.findByPk(request.params.id);
  })
  fastify.post('/', async function (request, reply) {
    if (!request.body?.name) {
      return reply.code(400).send('Le nom est obligatoire')
    }
    return await Task.create({
      name: request.body.name,
      state: false
    });
  })
  fastify.put('/:id', async function ({ params, body }, reply) {
    const id = params.id;
    let changes = {};
    if (!body || !body.name && !body.state) return null;
    if (body.name) changes.name = body.name;
    if (body.state) changes.state = body.state;
    Task.update(body, {
      where: {
        id
      }
    })
    return "Mis à jour"
  });
  fastify.delete('/:id', async function ({ params, body }, reply) {
    const id = params.id;
    Task.destroy({
      where: {
        id
      }
    })
    return "Tache supprimé"
  });
}
