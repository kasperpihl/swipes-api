import validate from 'validate.js';

validate.validators.isArray = (value, options, key, attributes) => {
  // The third parameter `true` means that the validation is strict
  if (validate.isArray(value)) {
    return undefined;
  }

  return `${key} should be an array`;
};

validate.validators.isBooleanOptinal = (value, options, key, attributes) => {
  // The third parameter `true` means that the validation is strict
  console.log('FHUIWEIFIQWEFIEWOEWIJOJIOEWFIOWEFJIO');
  console.log(value);
  if (!value || validate.isBoolean(value)) {
    return undefined;
  }

  return `${key} should be boolean`;
};

const isArray = {
  isArray: {},
};

const isBooleanOptinal = {
  isBooleanOptinal: {},
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
  isBooleanOptinal,
};
