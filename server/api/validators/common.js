import validate from 'validate.js';

validate.validators.isArray = (value, options, key, attributes) => {
  // The third parameter `true` means that the validation is strict
  if (validate.isArray(value)) {
    return undefined;
  }

  return `${key} should be an array`;
};

const isArray = {
  isArray: {},
};

const email = {
  presence: true,
  email: {
    message: 'is not valid',
  },
};

export {
  email,
  isArray,
};
