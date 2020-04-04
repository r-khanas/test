var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const convertToMongooseSchema = (jsonSchema) => {
  switch (jsonSchema.type) {
    // case "string":
    // case "number":
    // case "integer":
    // case "boolean":
    // case "null":
    //   return new Schema(convertValue(jsonSchema));
    case "object":
      return convertObject(jsonSchema);
  }
};

const convertObject = (jsonSchema) => {
  const mongooseObject = {};

  Object.entries(jsonSchema.properties).forEach(([key, value]) => {
    mongooseObject[key] = convertValue(value);
  });

  return new Schema(mongooseObject);
};

const convertValue = (jsonSchemaValue) => {
  switch (jsonSchemaValue.type) {
    case "string":
      return { type: String };
    case "number":
    case "integer":
      return { type: Number };
    case "boolean":
      return { type: Boolean };
    case "null":
      return null;
    case "object":
      return convertObject(jsonSchemaValue);
    case "array":
      return [convertValue(jsonSchemaValue.items)];
  }
};

module.exports = { convertToMongooseSchema };
