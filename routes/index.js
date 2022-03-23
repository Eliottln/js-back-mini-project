"use strict";

import alcools from "./alcools/index.js";

const allRoutes = {};

export default async function (fastify, opts) {
  fastify.addHook("onRoute", (routeOptions) => {
    if (!allRoutes.hasOwnProperty(routeOptions.prefix)) {
      allRoutes[routeOptions.prefix] = {};
    }

    if (
      !allRoutes[routeOptions.prefix].hasOwnProperty(routeOptions.routePath)
    ) {
      allRoutes[routeOptions.prefix][routeOptions.routePath] = [];
    }

    allRoutes[routeOptions.prefix][routeOptions.routePath].push(
      routeOptions.method
    );
  });

  fastify.get("/", async function (request, reply) {
    return {
      routes: allRoutes,
    };
  });
  fastify.register(alcools, { prefix: "alcoholic_drinks" });
}
