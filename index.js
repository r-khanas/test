const config = require("./config");
const fs = require("fs");
const { convertToMongooseSchema } = require("./services/convertServices");

const path = config.jsonSchema;

fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
  try {
    if (err) {
      throw new Error("Couldn't read the file");
    }

    const resultSchema = convertToMongooseSchema(JSON.parse(data));

    console.log(resultSchema);

    fs.writeFile(config.mongooseSchema, JSON.stringify(resultSchema), (err) => {
      if (err) {
        throw new Error("Couldn't write to the file");
      }
    });
  } catch (err) {
    console.error(err);
  }
});
