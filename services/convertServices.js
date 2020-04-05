const convertString = ({ minLength, maxLength, pattern }, required, indent) => {
  let string = `${indent}type: String`;
  if (required) {
    string += ` ,required: true`;
  }
  if (minLength !== undefined) {
    string += ` ,minlength: ${minLength}`;
  }
  if (maxLength !== undefined) {
    string += ` ,maxlength: ${maxLength}`;
  }
  if (pattern) {
    string += ` ,match: ${new RegExp(pattern)}`;
  }
  return `{\n  ${string}\n${indent}}`;
};

const convertNumber = ({ minimum, maximum }, required, indent) => {
  let string = `${indent}type: Number`;
  if (required) {
    string += ` ,required: true`;
  }
  if (minimum !== undefined) {
    string += ` ,min: ${minimum}`;
  }
  if (maximum !== undefined) {
    string += ` ,max: ${maximum}`;
  }
  return `{\n  ${string}\n${indent}}`;
};

const convertBoolean = (required, indent) => {
  let string = `${indent}type: Boolean`;
  if (required) {
    string += ` ,required: true`;
  }
  return `{\n  ${string}\n${indent}}`;
};

const convertToMongooseSchema = (jsonSchema) => {
  if (jsonSchema.type !== "object" || !jsonSchema.properties) {
    throw new Error("Unexpected JSON Schema");
  }
  return `const ${jsonSchema.title || "schema"} = ${convertObject(
    jsonSchema
  )};`;
};

const convertObject = (jsonSchema, indent = "") => {
  let string = ``;
  const requiredProperties = jsonSchema.required || [];
  const deeperIndent = indent + "  ";

  Object.entries(jsonSchema.properties).forEach(([key, value], index) => {
    const isRequired = requiredProperties.includes(key);
    string += `${index === 0 ? "" : ","}
${deeperIndent}${key}: ${convertValue(value, deeperIndent, isRequired)}`;
  });
  return `new Schema({${string}\n${indent}})`;
};

const convertValue = (jsonSchemaValue, indent, isRequired) => {
  switch (jsonSchemaValue.type) {
    case "string":
      return convertString(jsonSchemaValue, isRequired, indent);
    case "number":
    case "integer":
      return convertNumber(jsonSchemaValue, isRequired, indent);
    case "boolean":
      return convertBoolean(isRequired, indent);
    case "null":
      return null;
    case "object":
      return convertObject(jsonSchemaValue, indent);
    case "array":
      return `[\n${indent + "  "}${convertValue(
        jsonSchemaValue.items,
        indent + "  "
      )}\n${indent}]`;
  }
};

module.exports = { convertToMongooseSchema };
