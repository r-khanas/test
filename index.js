const config = require("./config");
const fs = require("fs");
const { convertToMongooseSchema } = require("./services/convertHelpers");

const path = config.jsonSchema;

fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
  if (err) {
    console.error(err);
  }
  const resultSchema = convertToMongooseSchema(JSON.parse(data));

  fs.writeFile(config.mongooseSchema, JSON.stringify(resultSchema), (err) => {
    if (err) {
      console.error(err);
    }
  });
});
