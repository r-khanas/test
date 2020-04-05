const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const {
  validateString,
  validateNumber,
  checkIfRequired,
} = require("./validationHelpers");

const convertToMongooseSchema = (jsonSchema) => {
  try {
    switch (jsonSchema.type) {
      case "object":
        return convertObject(jsonSchema);
      default:
        throw new Error("Invalid JSON Schema");
    }
  } catch (err) {
    console.log(err);
  }
};

const convertObject = (jsonSchema) => {
  const mongooseObject = {};

  const requiredProperties = jsonSchema.required || [];

  Object.entries(jsonSchema.properties).forEach(([key, value]) => {
    const isRequired = requiredProperties.includes(key);
    mongooseObject[key] = convertValue(value, isRequired);
  });

  return new Schema(mongooseObject);
};

const convertValue = (jsonSchemaValue, isRequired) => {
  switch (jsonSchemaValue.type) {
    case "string":
      return validateString(jsonSchemaValue, isRequired);
    case "number":
    case "integer":
      return validateNumber(jsonSchemaValue, isRequired);
    case "boolean":
      return checkIfRequired({ type: Boolean }, isRequired);
    case "null":
      return null;
    case "object":
      return convertObject(jsonSchemaValue);
    case "array":
      return [convertValue(jsonSchemaValue.items)];
  }
};

module.exports = { convertToMongooseSchema };