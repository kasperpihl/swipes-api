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

const linkAdd = Object.assign({}, linkConstraints, permissionConstraints, metaConstraints);
const validateLinkAdd = validatorMiddleware(linkAdd);
const validateLinkGet = validatorMiddleware({ ids });

export {
  validateLinkAdd,
  validateLinkGet,
};
