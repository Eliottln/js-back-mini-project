"use strict";

import fs from "fs";
import mime from "mime-types";
import { Op } from "sequelize";
import { AlcoholicDrink } from "../../database.js";

function writeImageById(id, image) {
  const dataChunks = image.split(";");
  const ext = mime.extension(dataChunks[0].replace("data:", ""));
  const base64Data = dataChunks[1].replace("base64,", "");

  fs.writeFileSync(`img\\${id}.${ext}`, base64Data, "base64");
}

function findImageById(id) {
  for (let file of fs.readdirSync("img")) {
    if (file.startsWith(id)) {
      return `img\\${file}`;
    }
  }
  return null;
}

function removeImage(id) {
  const file = findImageById(id);
  if (file === null) return;

  fs.unlinkSync(file);
}

function overwriteImage(id, image) {
  removeImage(id);
  writeImageById(id, image);
}

function addImageAttribute(alcohol) {
  const file = findImageById(alcohol.id);
  const base64Data = fs.readFileSync(file).toString("base64");

  return {
    ...alcohol.toJSON(),
    image: `data:${mime.lookup(file)};base64,${base64Data}`,
  };
}

const statusCodeToErrorType = { 400: "Bad Request", 404: "Not Found" };

function createError(reply, code, msg) {
  reply.code(code);
  return {
    error: statusCodeToErrorType[code],
    message: msg,
    statusCode: code,
  };
}

export default async function (fastify, opts) {
  fastify.get("/", async function (request, reply) {
    const query = request.query;
    const type = query?.type;
    const name = query?.name;
    const description = query?.description;
    const estimatedPrice = query?.estimatedPrice;
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
    if (estimatedPrice !== undefined) {
      where.estimatedPrice = estimatedPrice;
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

    const response = await AlcoholicDrink.findAll(options);

    let res = [];
    for (let element of response) {
      res.push(addImageAttribute(element));
    }

    return res;
  });

  fastify.get("/:id", async function (request, reply) {
    const id = request.params.id;
    const response = await AlcoholicDrink.findByPk(id);

    if (response === null) {
      return createError(reply, 404, `There is no record with the id ${id}.`);
    }

    return addImageAttribute(response);
  });

  fastify.post("/", async function (request, reply) {
    const body = request.body;
    const type = body?.type;
    const name = body?.name;
    const description = body?.description;
    const estimatedPrice = body?.estimatedPrice;
    const alcoholLevel = body?.alcoholLevel;
    const image = body?.image;

    if (type === undefined || name === undefined || description === undefined) {
      return createError(reply, 400, "Some attributes are missing.");
    }

    const values = {
      type: type,
      name: name,
      description: description,
    };

    if (estimatedPrice !== undefined) {
      values.estimatedPrice = estimatedPrice;
    }
    if (alcoholLevel !== undefined) {
      values.alcoholLevel = alcoholLevel;
    }

    const response = await AlcoholicDrink.create(values);

    if (image !== undefined) {
      writeImageById(response.id, image);
    }

    return addImageAttribute(response);
  });

  fastify.put("/:id", async function (request, reply) {
    const body = request.body;
    const type = body?.type;
    const name = body?.name;
    const description = body?.description;
    const estimatedPrice = body?.estimatedPrice;
    const alcoholLevel = body?.alcoholLevel;
    const image = body?.image;

    const changedValues = {};
    if (type !== undefined) {
      changedValues.type = type;
    }
    if (name !== undefined) {
      changedValues.name = name;
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

  fastify.get("/stats", async function (request, reply) {
    const allAlcoholDrinks = await AlcoholicDrink.findAll();
    const nbAlcoholDrinks = allAlcoholDrinks.length;
    let collectionValue = 0;
    allAlcoholDrinks.forEach((alcohol) => {
      collectionValue += alcohol.estimatedPrice;
    });

    return {
      total: nbAlcoholDrinks,
      collectionValue,
      meanValue: nbAlcoholDrinks > 0 ? collectionValue / nbAlcoholDrinks : 0,
    };
  });

  fastify.delete("/:id", async function (request, reply) {
    const id = request.params.id;
    AlcoholicDrink.destroy({ where: { id } });
    removeImage(id);
    reply.code(204);
  });
}
