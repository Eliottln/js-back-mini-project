"use strict";

import fastifyCors from "fastify-cors";
import "./database.js";
import sensible from "./plugins/sensible.js";
import support from "./plugins/support.js";
import routes from "./routes/index.js";

export default async function (fastify, opts) {
  // fastify.setNotFoundHandler(function (request, reply) {
  //   // Default not found handler with preValidation and preHandler hooks
  // });

  fastify.register(sensible);
  fastify.register(support);
  fastify.register(fastifyCors);
  fastify.register(routes);
}
