var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const convertToMongooseSchema = (jsonSchema) => {
  switch (jsonSchema.type) {
    case "object":
      return convertObject(jsonSchema);
  }
};

const checkIfRequired = (value, required) => {
  return { ...value, ...(required && { required }) };
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
      return checkIfRequired({ type: String }, isRequired);
    case "number":
    case "integer":
      return checkIfRequired({ type: Number }, isRequired);
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
