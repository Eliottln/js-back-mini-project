"use strict";

import alcools from "./alcools/index.js";

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    return {
      root: true,
      routes: {
        alcoholic_drinks: [],
      },
    };
  });
  fastify.register(alcools, { prefix: "alcoholic_drinks" });
}
