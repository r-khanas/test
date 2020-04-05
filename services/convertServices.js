const convertString = ({ minLength, maxLength, pattern }, required, ident) => {
  let string = `${ident}type: String, `;
  if (required) {
    string += `required: true, `;
  }
  if (minLength !== undefined) {
    string += `minlength: ${minLength}, `;
  }
  if (maxLength !== undefined) {
    string += `maxlength: ${maxLength}, `;
  }
  if (pattern) {
    string += `match: ${new RegExp(pattern)}, `;
  }
  return `{
  ${string}
${ident}},`;
};

const convertNumber = ({ minimum, maximum }, required, ident) => {
  let string = `${ident}type: Number, `;
  if (required) {
    string += `required: true, `;
  }
  if (minimum !== undefined) {
    string += `min: ${minimum}, `;
  }
  if (maximum !== undefined) {
    string += `max: ${maximum}, `;
  }
  return `{
  ${string}${ident}
  },`;
};

const convertBoolean = (required, ident) => {
  let string = `${ident}type: Boolean, `;
  if (required) {
    string += `required: true, `;
  }
  return `{
  ${string}${ident}
  },`;
};

const convertToMongooseSchema = (jsonSchema) => {
  if (jsonSchema.type !== "object" || !jsonSchema.properties) {
    throw new Error("Unexpected JSON Schema");
  }
  return `const ${jsonSchema.title || "schema"} = ${convertObject(jsonSchema)}`;
};

const convertObject = (jsonSchema, ident = "") => {
  let string = ``;
  const requiredProperties = jsonSchema.required || [];
  ident += "  ";

  Object.entries(jsonSchema.properties).forEach(([key, value]) => {
    const isRequired = requiredProperties.includes(key);
    string += `
${ident}${key}: ${convertValue(value, isRequired, ident)}`;
  });
  return `new Schema({${string}
${ident.slice(2)}}),`;
};

const convertValue = (jsonSchemaValue, isRequired, ident) => {
  switch (jsonSchemaValue.type) {
    case "string":
      return convertString(jsonSchemaValue, isRequired, ident);
    case "number":
    case "integer":
      return convertNumber(jsonSchemaValue, isRequired, ident);
    case "boolean":
      return convertBoolean(isRequired, ident);
    case "null":
      return null;
    case "object":
      return convertObject(jsonSchemaValue, ident);
    case "array":
      ident += "  ";
      return `[
    ${convertValue(jsonSchemaValue.items, undefined, ident)}
  ],`;
  }
};

module.exports = { convertToMongooseSchema };
