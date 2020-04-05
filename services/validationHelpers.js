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
  type: Number,
  ...(required && { required }),
  ...(minimum && { min: minimum }),
  ...(maximum && { max: maximum }),
});

module.exports = { checkIfRequired, validateString, validateNumber };
