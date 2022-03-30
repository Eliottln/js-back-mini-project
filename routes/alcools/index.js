"use strict";

import { Op } from "sequelize";
import { AlcoholicDrink } from "../../database.js";

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const query = request.query;
    const type = query?.type;
    const name = query?.name;
    const description = query?.description;
    const evaluatedPrice = query?.evaluatedPrice;
    const alcoholLevel = query?.alcoholLevel;
    const createdAt = query?.createdAt;
    const updatedAt = query?.updatedAt;

    const options = { where: {} };
    const where = options.where;

    if (type !== undefined) {
      where.type = { [Op.substring]: type };
    }
    if (name !== undefined) {
      where.name = { [Op.substring]: name };
    }
    if (description !== undefined) {
      where.description = { [Op.substring]: description };
    }
    if (evaluatedPrice !== undefined) {
      where.evaluatedPrice = evaluatedPrice;
    }
    if (alcoholLevel !== undefined) {
      where.alcoholLevel = alcoholLevel;
    }
    if (createdAt !== undefined) {
      where.createdAt = createdAt;
    }
    if (updatedAt !== undefined) {
      where.updatedAt = updatedAt;
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
    const evaluatedPrice = body?.evaluatedPrice;
    const alcoholLevel = body?.alcoholLevel;

    if (type === undefined || name === undefined || description === undefined) {
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
    };

    if (evaluatedPrice !== undefined) {
      values.evaluatedPrice = evaluatedPrice;
    }
    if (alcoholLevel !== undefined) {
      values.alcoholLevel = alcoholLevel;
    }
    return AlcoholicDrink.create(values);
  });

  fastify.put("/:id", async function (request, reply) {
    const body = request.body;
    const type = body?.type;
    const name = body?.name;
    const description = body?.description;
    const evaluatedPrice = body?.evaluatedPrice;
    const alcoholLevel = body?.alcoholLevel;

    const changedValues = {};
    if (type !== undefined) {
      changedValues.type = type;
    } else if (name !== undefined) {
      changedValues.name = name;
    } else if (description !== undefined) {
      changedValues.description = description;
    } else if (evaluatedPrice !== undefined) {
      changedValues.evaluatedPrice = evaluatedPrice;
    } else if (alcoholLevel !== undefined) {
      changedValues.alcoholLevel = alcoholLevel;
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
    await AlcoholicDrink.destroy({where: {id: request.params.id}});
  });
}
