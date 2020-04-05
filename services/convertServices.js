const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const convertString = ({ minLength, maxLength, pattern }, required) => ({
  type: String,
  ...(required && { required }),
  ...(minLength !== undefined && { minlength: minLength }),
  ...(maxLength !== undefined && { maxlength: maxLength }),
  ...(pattern && { match: new RegExp(pattern) }),
});

const convertNumber = ({ minimum, maximum }, required) => ({
  type: Number,
  ...(required && { required }),
  ...(minimum !== undefined && { min: minimum }),
  ...(maximum !== undefined && { max: maximum }),
});

const convertBoolean = (required) => ({
  type: Boolean,
  ...(required && { required }),
});

const convertToMongooseSchema = (jsonSchema) => {
  if (jsonSchema.type !== "object") {
    throw new Error("Unexpected JSON Schema");
  }
  return convertObject(jsonSchema);
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
      return convertString(jsonSchemaValue, isRequired);
    case "number":
    case "integer":
      return convertNumber(jsonSchemaValue, isRequired);
    case "boolean":
      return convertBoolean(isRequired);
    case "null":
      return null;
    case "object":
      return convertObject(jsonSchemaValue);
    case "array":
      return [convertValue(jsonSchemaValue.items)];
  }
};

module.exports = { convertToMongooseSchema };
