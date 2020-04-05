var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const convertToMongooseSchema = (jsonSchema) => {
  switch (jsonSchema.type) {
    case "object":
      return convertObject(jsonSchema);
  }
};

const checkIfRequired = (value, required) => ({
  ...value,
  ...(required && { required }),
});

const validateString = ({ minLength, maxLength, pattern }, required) => ({
  type: String,
  ...(required && { required }),
  ...(minLength && { minlength: minLength }),
  ...(maxLength && { maxlength: maxLength }),
  ...(pattern && { match: new RegExp(pattern) }),
});

const validateNumber = ({ minimum, maximum }, required) => ({
  type: String,
  ...(required && { required }),
  ...(minimum && { min: minimum }),
  ...(maximum && { max: maximum }),
});

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
