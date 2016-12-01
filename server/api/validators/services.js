import {
  validatorMiddleware,
} from './validation-wrapper';

const service_name = {
  presence: true,
};
const account_id = {
  presence: true,
};
const query = {
  presence: true,
};
const dataConstraints = {
  'data.method': {
    presence: true,
  },
};

const requestConstraints = Object.assign({}, dataConstraints, { service_name, account_id });
const authSuccessConstraints = Object.assign({}, { service_name, query });
const validateServicesAuthorize = validatorMiddleware({ service_name });
const validateServicesAuthorizeSuccess = validatorMiddleware(authSuccessConstraints);
const validateServicesRequest = validatorMiddleware(requestConstraints);
const validateGetServiceFromUser = validatorMiddleware({ account_id });

export {
  validateServicesAuthorize,
  validateServicesRequest,
  validateServicesAuthorizeSuccess,
  validateGetServiceFromUser,
};
