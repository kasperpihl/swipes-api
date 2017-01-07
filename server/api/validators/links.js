import {
  validatorMiddleware,
  validatorModelMiddleware,
} from './validation-wrapper';

const ids = {
  presence: true,
};

const linkConstraints = {
  'link.id': { presence: true },
  'link.type': { presence: true },
  'link.service_name': { presence: true },
};

const permissionConstraints = {
  'permission.account_id': { presence: true },
};

const metaConstraints = {
  'meta.title': { presence: true },
};

const preVal = Object.assign({}, linkConstraints, permissionConstraints, metaConstraints);
const preValidateLinkAdd = validatorModelMiddleware(preVal);
const validateLinkAdd = validatorMiddleware();
const validateLinkGet = validatorMiddleware({ ids });

export {
  preValidateLinkAdd,
  validateLinkAdd,
  validateLinkGet,
};
