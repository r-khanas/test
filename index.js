const config = require("./config");
const fs = require("fs");
const { convertToMongooseSchema } = require("./services");

const path = config.jsonSchema;

fs.readFile(path, { encoding: "utf-8" }, (err, data) => {
  if (err) {
    console.error(err);
  }
  const result = convertToMongooseSchema(JSON.parse(data));
  console.log(result);
  fs.writeFile(config.mongooseSchema, result, (err) => {
    if (err) {
      console.error(err);
    }
    // console.log("Successfully written", mongooseSchema);
  });
});
