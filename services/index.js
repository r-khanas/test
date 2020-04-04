var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const convertJson = (jsonSchema) => {
  if (jsonSchema.type === "object") {
    Object.entries(jsonSchema.properties).forEach(([key, value]) => {
      convertJson(value);
    });
  } else if (jsonSchema.type === "array") {
    console.log(jsonSchema.items);
  } else {
    console.log(jsonSchema);
  }
};

module.exports = { convertJson };
