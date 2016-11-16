"use strict";

import {
  validatorMiddleware
} from './validation-wrapper';

const manifest_id = {
  presence: true
}

const account_id = {
  presence: true
}

const query = {
  presence: true
}

const dataConstraints = {
  "data.method": {
    presence: true
  },
  "data.parameters": {
    presence: true
  }
}

const requestConstraints = Object.assign({}, dataConstraints, { manifest_id, account_id });
const authSuccessConstraints = Object.assign({}, { manifest_id, query });

const validateServicesAuthorize = validatorMiddleware({ manifest_id });
const validateServicesAuthorizeSuccess = validatorMiddleware(authSuccessConstraints);
const validateServicesRequest = validatorMiddleware(requestConstraints);

export {
  validateServicesAuthorize,
  validateServicesRequest,
  validateServicesAuthorizeSuccess
}
