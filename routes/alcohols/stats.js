"use strict";

import { AlcoholicDrink } from "../../database.js";

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const allAlcoholDrinks = await AlcoholicDrink.findAll();
    const nbAlcoholDrinks = allAlcoholDrinks.length;

    let collectionValue = 0;
    allAlcoholDrinks.forEach((alcohol) => {
      collectionValue +=
        alcohol.estimatedPrice !== null ? alcohol.estimatedPrice : 0;
    });

    return {
      total: nbAlcoholDrinks,
      collectionValue,
      meanValue: nbAlcoholDrinks > 0 ? collectionValue / nbAlcoholDrinks : 0,
    };
  });
}
