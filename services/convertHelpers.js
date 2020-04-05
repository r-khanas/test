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
        return `const ${jsonSchema.title || "schema"} = ${convertObject(
          jsonSchema
        )}`;
      default:
        throw new Error("Invalid JSON Schema");
    }
  } catch (err) {
    console.log(err);
  }
};

const convertObject = (jsonSchema) => {
  let string = ``;

  const requiredProperties = jsonSchema.required || [];
  // const lastPropertyIndex = Object.entries(jsonSchema.properties).length -1

  Object.entries(jsonSchema.properties).forEach(([key, value], index) => {
    const isRequired = requiredProperties.includes(key);
    string += `  ${key}: ${convertValue(value, isRequired)}`;
  });
  return `new Schema({
${string}}),
`;
};

const convertValue = (jsonSchemaValue, isRequired) => {
  switch (jsonSchemaValue.type) {
    case "string":
      return validateString(jsonSchemaValue, isRequired);
    case "number":
    case "integer":
      return validateNumber(jsonSchemaValue, isRequired);
    case "boolean":
      return checkIfRequired(jsonSchemaValue);
    case "null":
      return null;
    case "object":
      return convertObject(jsonSchemaValue);
    case "array":
      return `[
  ${convertValue(jsonSchemaValue.items)}],`;
  }
};

module.exports = { convertToMongooseSchema };
