"use strict";

import alcohols from "./alcohols/index.js";

const allRoutes = {};

export default async function (fastify, opts) {
  fastify.addHook("onRoute", (routeOptions) => {
    let url = routeOptions.url;
    if (!url.endsWith("/")) {
      url = `${url}/`;
    }
    let pathChunks = url.split("/");
    pathChunks = pathChunks.splice(0, pathChunks.length);

    let route = allRoutes;
    for (const [index, pathChunk] of pathChunks.entries()) {
      const fixedPathChunk = `${pathChunk}/`;

      if (route[fixedPathChunk] === undefined) {
        if (index >= pathChunks.length - 1) break;

        route[fixedPathChunk] = {};
      }
      route = route[fixedPathChunk];
    }

    route[routeOptions.method] = `${routeOptions.method} ${routeOptions.url}`;
  });

  fastify.get("/", async function (request, reply) {
    return {
      routes: allRoutes,
    };
  });
  fastify.register(alcohols, { prefix: "alcoholic_drinks" });
}
