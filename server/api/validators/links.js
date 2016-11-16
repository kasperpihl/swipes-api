"use strict";

import {
  SwipesError
} from '../../middlewares/swipes-error';
import {
  validatorMiddleware,
  validatorModelMiddleware
} from './validation-wrapper';

const shortUrlConstraints = {
  "shortUrl": {
    presence: true
  }
}

const checksumConstraints = {
  "checksum": {
    presence: true
  }
}

const linkConstraints = {
  "link.id": { presence: true },
  "link.type": { presence: true },
  "link.service": { presence: true }
}

const permissionConstraints = {
  "permission.account_id": { presence: true }
}

const metaConstraints = {
  "meta.title": { presence: true }
}

const constructModelLinkAdd = (body) => {
  const {
    link,
    shortUrl,
    permission,
    checksum,
    meta
  } = body;

  if (!link && !shortUrl && !checksum) {
    return new SwipesError('One of the following is required - link, checksum or shortUrl');
  }

  if (shortUrl) {
    return shortUrlConstraints;
  }

  if (checksum) {
    return Object.assign({}, permissionConstraints, checksumConstraints);
  }

  return Object.assign({}, linkConstraints, permissionConstraints, metaConstraints);
}

const preValidateLinkAdd = validatorModelMiddleware(constructModelLinkAdd);
const validateLinkAdd = validatorMiddleware();

export {
  preValidateLinkAdd,
  validateLinkAdd
}
