"use strict";

const express = require('express');
const validator = require('validator');
import SwipesError from '../swipes-error.js';
import {
  createSwipesShortUrl,
  addPermissionsToALink,
  findPermissionsById
} from '../utils/share_url_util'

const router = express.Router();

const validateData = (req, res, next) => {
  const link = req.body.link;
  const permission = req.body.permission;
  const meta = req.body.meta || null;
  const shortUrl = req.body.short_url ? req.body.short_url.toString() : null;
  let checksum = req.body.checksum;

  if (validator.isNull(link) && validator.isNull(checksum) && validator.isNull(shortUrl)) {
    return next(new SwipesError('link or checksum or shortUrl are required'));
  }

  if (!shortUrl && validator.isNull(permission)) {
    return next(new SwipesError('permission is required'));
  }

  if (!shortUrl && validator.isNull(permission.account_id)) {
    return next(new SwipesError('account_id of permission is required'));
  }

  if (link && (
      validator.isNull(link.service) ||
      validator.isNull(link.type) ||
      validator.isNull(link.id))
  ) {
    return next(new SwipesError('service, type and id of link are required'));
  }

  if (meta && !meta.title) {
    return next(new SwipesError('meta.title is required'));
  }

  if (!validator.isNull(checksum)) {
    checksum = checksum.toString();
    res.locals.checksum = checksum;
  }

  if (validator.isNull(checksum) && validator.isNull(shortUrl)) {
    link.service = link.service.toString();
    link.type = link.type.toString();
    link.id = link.id.toString();
    res.locals.link = {
      id: link.id,
      type: link.type,
      service: link.service
    };
  }

  if (!shortUrl) {
    permission.type = permission.type ? permission.type.toString() : 'public';
    permission.account_id = permission.account_id.toString();
    res.locals.permission = {
      type: permission.type,
      account_id: permission.account_id
    };
  }

  if (meta) {
    meta.title = meta.title.toString();
    res.locals.meta = {
      title: meta.title.toString()
    };

    if (meta.subtitle) {
      res.locals.meta['subtitle'] = meta.subtitle.toString();
    }
  } else {
    res.locals.meta = meta;
  }

  res.locals.shortUrl = shortUrl;

  return next();
}

/**
  example
  {JSON} service
  {
    link: {
      service: 'slack',
      type: 'task / message / email / file',
      id: 'T123A'
    },
    meta: {
      // Swipes Card properties
    },
    permission: {
      type: 'public',
      account_id: 'service account id - to use from swipes'
    }
  }

**/
router.post('/link.add', validateData, (req, res, next) => {
  const userId = req.userId;
  const checksum = res.locals.checksum;
  const link = res.locals.link;
  const shortUrl = res.locals.shortUrl;
  const permission = res.locals.permission || {};
  const permissionType = permission.type || 'public';
  const accountId = permission.account_id;
  const meta = res.locals.meta;
  let newMeta;
  let newPermission;

  findPermissionsById(shortUrl)
    .then((result) => {
      if (result && result.length > 0) {
        newPermission = result[0].permission;

        return Promise.resolve({
          meta: result[0].meta,
          checksum: result[0].checksum
        })
      } else {
        newPermission = {
          type: permissionType,
          account_id: accountId,
          user_id: userId
        }

        return createSwipesShortUrl({ userId, accountId, link, checksum, meta })
      }
    })
    .then(({meta, checksum}) => {
      const permission = {
        type: permissionType,
        account_id: accountId
      }

      newMeta = meta;

      return addPermissionsToALink({ userId, checksum, permission: newPermission });
    })
    .then(({ permissionPart }) => {
      const short_url = permissionPart;

      return res.status(200).json({ok: true, short_url, meta: newMeta});
    })
    .catch((err) => {
      return next(err);
    })
});

module.exports = router;
