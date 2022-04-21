import fs from "fs";
import mime from "mime-types";

export function writeImageById(id, image) {
  const dataChunks = image.split(";");
  const ext = mime.extension(dataChunks[0].replace("data:", ""));
  const base64Data = dataChunks[1].replace("base64,", "");

  fs.writeFileSync(`img\\${id}.${ext}`, base64Data, "base64");
}

export function findImageById(id) {
  for (const file of fs.readdirSync("img")) {
    if (file.startsWith(id)) {
      return `img\\${file}`;
    }
  }
  return null;
}

export function addImageAttribute(alcohol) {
  const file = findImageById(alcohol.id);
  const image =
    file !== null
      ? `data:${mime.lookup(file)};base64,${fs
          .readFileSync(file)
          .toString("base64")}`
      : null;

  return {
    ...alcohol.toJSON(),
    image,
  };
}

const statusCodeToErrorType = { 400: "Bad Request", 404: "Not Found" };

export function createError(reply, code, msg) {
  reply.code(code);
  return {
    error: statusCodeToErrorType[code],
    message: msg,
    statusCode: code,
  };
}
