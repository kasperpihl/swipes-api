"use strict";

import { validatorMiddleware } from './validation-wrapper';

import {
  email
} from './common';

const password = {
  presence: {
    message: 'is required'
  },
  length: {
    minimum: 1
  }
}

const name = {
  presence: {
    message: 'is required'
  },
  length: {
    maximum: 32
  }
}

const organization = {
  presence: {
    message: 'is required'
  },
  length: {
    maximum: 64
  }
}

// Make a custom validator here
// const invitationCode = t.subtype(t.Str, function (s) {
//   return s.startsWith('SW319-');
// });

const validateSignUp = validatorMiddleware({
  email,
  password,
  name,
  organization
});

const validateSignIn = validatorMiddleware({
  email,
  password
});

export {
  validateSignUp,
  validateSignIn
}
