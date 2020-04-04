var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const convertType = (type) => {
  switch (type.type) {
    case "string":
      return { type: String };
    case "number":
      return { type: Number };
  }
};

const convertArray = (array, mongooseSchema) => {
  let newArray = [convertType(array.value.items)];
  // Object.entries(array.value.items).forEach(([key, value]) =>
  //   newArray.push({ [key]: value })
  // );
  Object.assign(mongooseSchema, { [array.key]: newArray });
  return mongooseSchema;
};

const convertObject = (properties, mongooseSchema) => {
  let newSchema = {};
  Object.entries(properties).forEach(([key, value]) => {
    if (value.type === "object") {
      convertObject({ [key]: value.properties }, newSchema);
    } else if (value.type === "array") {
      convertArray({ key, value }, mongooseSchema);
    } else {
      Object.assign(newSchema, { [key]: value });
    }
    Object.assign(mongooseSchema, newSchema);
  });
  return mongooseSchema;
};

const convertJson = (jsonSchema, mongooseSchema) => {
  if (jsonSchema.type === "object") {
    convertObject(jsonSchema.properties, mongooseSchema);
  } else {
    console.log(jsonSchema);
    Object.assign(mongooseSchema, convertType(jsonSchema));
  }
  return mongooseSchema;
};

module.exports = { convertJson };
