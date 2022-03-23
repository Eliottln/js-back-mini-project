"use strict";

import { Op } from "sequelize";
import { AlcoholicDrink } from "../../database.js";

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const query = request.query;
    const type = query?.type;
    const name = query?.name;
    const description = query?.description;
    const imagePath = query?.imagePath;
    const evaluatedPrice = query?.evaluatedPrice;
    const alcoholLevel = query?.alcoholLevel;
    const createdAt = query?.createdAt;
    const updatedAt = query?.updatedAt;

    const options = { where: {} };
    if (type !== undefined) {
      options.where.type = type;
    }
    if (name !== undefined) {
      options.where.name = { [Op.substring]: name };
    }
    if (description !== undefined) {
      options.where.description = { [Op.substring]: description };
    }
    if (imagePath !== undefined) {
      options.where.imagePath = imagePath;
    }

    return await AlcoholicDrink.findAll(options);
  });

  fastify.get("/:id", async function (request, reply) {
    return await AlcoholicDrink.findByPk(request.params.id);
  });

  fastify.post("/", async function (request, reply) {
    const body = request.body;
    const type = body?.type;
    const name = body?.name;
    const description = body?.description;
    const imagePath = body?.imagePath;
    const evaluatedPrice = body?.evaluatedPrice;
    const alcoholLevel = body?.alcoholLevel;

    if (
      type === undefined ||
      name === undefined ||
      description === undefined ||
      imagePath === undefined
    ) {
      reply.code(400).header("Content-Type", "application/json; charset=utf-8");
      return {
        error: "Bad Request",
        message: "Le nom est invalid.",
        statusCode: reply.statusCode,
      };
    }

    const values = {
      type: type,
      name: name,
      description: description,
      imagePath: imagePath,
    };

    if (evaluatedPrice !== undefined) {
      values.evaluatedPrice = evaluatedPrice;
    }
    if (alcoholLevel !== undefined) {
      values.alcoholLevel = alcoholLevel;
    }
    return await AlcoholicDrink.create(values);
  });

  fastify.put("/:id", async function (request, reply) {
    const body = request.body;
    const type = body?.type;
    const name = body?.name;
    const description = body?.description;
    const imagePath = body?.imagePath;

    const changedValues = {};
    if (type !== undefined) {
      changedValues.type = type;
    } else if (name !== undefined) {
      changedValues.name = name;
    } else if (description !== undefined) {
      changedValues.description = description;
    } else if (imagePath !== undefined) {
      changedValues.imagePath = imagePath;
    }

    if (Object.keys(changedValues).length === 0) {
      reply.code(400).header("Content-Type", "application/json; charset=utf-8");
      return {
        error: "Bad Request",
        message: "Aucun champ n'a été changé.",
        statusCode: reply.statusCode,
      };
    }

    const currentAlcoholicDrink = await AlcoholicDrink.findOne({
      where: { id: request.params.id },
    });
    return await currentAlcoholicDrink.update(changedValues);
  });

  fastify.get("/stats", async function (request, reply) {
    const allAlcoholDrinks = await AlcoholicDrink.findAll();
    const nbAlcoholDrinks = allAlcoholDrinks.length;

    return {
      total: nbAlcoholDrinks,
    };
  });

  fastify.delete("/:id", async function (request, reply) {
    AlcoholicDrink.destroy({ where: { id: request.params.id } });
  });
}
