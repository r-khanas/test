const config = require("./config");
const fs = require("fs");
const { convertJson } = require("./services");

const path = config.jsonSchema;

fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
  if (err) {
    console.error(err);
  }

  const mongooseSchema = convertJson(JSON.parse(data));

  fs.writeFile(config.mongooseSchema, mongooseSchema, (err) => {
    if (err) {
      console.error(err);
    }
    // console.log("Successfully written", mongooseSchema);
  });
});
