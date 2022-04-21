"use strict";

import { Op } from "sequelize";
import { AlcoholicDrink } from "../../database.js";
import item from "./item.js";
import stats from "./stats.js";
import { addImageAttribute, createError, writeImageById } from "./_utils.js";

function checkIfValid(...args) {
  for (const arg of args) {
    if (arg === null || arg === undefined) return false;
  }
  return true;
}

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const query = request.query;
    const name = query?.name;
    const type = query?.type;
    const description = query?.description;
    const estimatedPrice = query?.estimatedPrice;
    const alcoholLevel = query?.alcoholLevel;
    const createdAt = query?.createdAt;
    const updatedAt = query?.updatedAt;

    const options = { where: {} };
    const where = options.where;

    if (checkIfValid(name)) {
      where.name = { [Op.substring]: name };
    }
    if (checkIfValid(type)) {
      where.type = { [Op.substring]: type };
    }
    if (checkIfValid(description)) {
      where.description = { [Op.substring]: description };
    }
    if (checkIfValid(estimatedPrice)) {
      where.estimatedPrice = estimatedPrice;
    }
    if (checkIfValid(alcoholLevel)) {
      where.alcoholLevel = alcoholLevel;
    }
    if (checkIfValid(createdAt)) {
      where.createdAt = createdAt;
    }
    if (checkIfValid(updatedAt)) {
      where.updatedAt = updatedAt;
    }

    const response = await AlcoholicDrink.findAll(options);

    let res = [];
    for (const element of response) {
      res.push(addImageAttribute(element));
    }

    return res;
  });

  fastify.post("/", async function (request, reply) {
    const body = request.body;
    const name = body?.name;
    const type = body?.type;
    const description = body?.description;
    const estimatedPrice = body?.estimatedPrice;
    const alcoholLevel = body?.alcoholLevel;
    const image = body?.image;

    if (!checkIfValid(type, name, description, estimatedPrice, image)) {
      return createError(reply, 400, "Some attributes are missing.");
    }

    const values = {
      name,
      type,
      description,
      estimatedPrice,
    };

    if (alcoholLevel !== undefined) {
      values.alcoholLevel = alcoholLevel;
    }

    const response = await AlcoholicDrink.create(values);

    writeImageById(response.id, image);

    return addImageAttribute(response);
  });

  fastify.register(item, { prefix: ":id" });
  fastify.register(stats, { prefix: "stats" });
}
