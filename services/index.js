var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const convertJson = (jsonSchema, mongooseSchema) => {
  if (jsonSchema.type === "object") {
    let newSchema = {};
    Object.entries(jsonSchema.properties).forEach(([key, value]) => {
      console.log("KEY", key, "VALUE", value);
      if (value.type === "object") {
        Object.assign(newSchema, { [key]: convertJson(value, newSchema) });
      } else {
        Object.assign(newSchema, { [key]: value });
      }
    });
    Object.assign(mongooseSchema, newSchema);
  } else {
    Object.assign(mongooseSchema, jsonSchema);
  }
  return mongooseSchema;
};

module.exports = { convertJson };
