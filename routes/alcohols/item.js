"use strict";

import fs from "fs";
import { AlcoholicDrink } from "../../database.js";
import {
  addImageAttribute,
  findImageById,
  createError,
  writeImageById,
} from "./_utils.js";

function removeImages(id) {
  let file = findImageById(id);
  while (file !== null) {
    fs.unlinkSync(file);
    file = findImageById(id);
  }
}

function overwriteImage(id, image) {
  removeImages(id);
  if (image !== null) writeImageById(id, image);
}

function checkIfNotNull(...args) {
  for (const arg of args) {
    if (arg === null) return false;
  }
  return true;
}

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const id = request.params.id;
    const response = await AlcoholicDrink.findByPk(id);

    if (response === null) {
      return createError(reply, 404, `There is no record with the id ${id}.`);
    }

    return addImageAttribute(response);
  });

  fastify.put("/", async function (request, reply) {
    const body = request.body;
    const name = body?.name;
    const type = body?.type;
    const description = body?.description;
    const estimatedPrice = body?.estimatedPrice;
    const alcoholLevel = body?.alcoholLevel;
    const image = body?.image;

    if (!checkIfNotNull(type, name, description, estimatedPrice, image)) {
      return createError(reply, 400, "Some required attributes are null.");
    }

    const changedValues = {};
    if (name !== undefined) {
      changedValues.name = name;
    }
    if (type !== undefined) {
      changedValues.type = type;
    }
    if (description !== undefined) {
      changedValues.description = description;
    }
    if (estimatedPrice !== undefined) {
      changedValues.estimatedPrice = estimatedPrice;
    }
    if (alcoholLevel !== undefined) {
      changedValues.alcoholLevel = alcoholLevel;
    }

    const currentAlcoholicDrink = await AlcoholicDrink.findOne({
      where: { id: request.params.id },
    });
    const response = await currentAlcoholicDrink.update(changedValues);

    if (image !== undefined) {
      overwriteImage(request.params.id, image);
    }

    return addImageAttribute(response);
  });

  fastify.delete("/", async function (request, reply) {
    const id = request.params.id;
    AlcoholicDrink.destroy({ where: { id } });
    removeImages(id);
    reply.code(204);
  });
}
