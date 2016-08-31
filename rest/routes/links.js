"use strict";

const express = require('express');
const validator = require('validator');
import SwipesError from '../swipes-error.js';
import {
  createSwipesShortUrl,
  addPermissionsToALink
} from '../utils/share_url_util'

const router = express.Router();

const validateData = (req, res, next) => {
  const link = req.body.link;
  const permission = req.body.permission;
  const meta = req.body.meta || null;
  let checksum = req.body.checksum;

  if (validator.isNull(link) && validator.isNull(checksum)) {
    return next(new SwipesError('link or checksum are required'));
  }

  if (validator.isNull(permission)) {
    return next(new SwipesError('permission is required'));
  }

  if (link && (
      validator.isNull(link.service) ||
      validator.isNull(link.type) ||
      validator.isNull(link.id))
  ) {
    return next(new SwipesError('service, type and id of link are required'));
  }

  if (validator.isNull(permission.type) ||
      validator.isNull(permission.account_id)) {
    return next(new SwipesError('type, account_id of permission are required'));
  }

  if (meta && meta.data && !meta.data.title) {
    return next(new SwipesError('meta.title is required'));
  }

  if (!validator.isNull(checksum)) {
    checksum = checksum.toString();
    res.locals.checksum = checksum;
  } else {
    link.service = link.service.toString();
    link.type = link.type.toString();
    link.id = link.id.toString();
    res.locals.link = link;
  }

  permission.type = permission.type.toString();
  permission.account_id = permission.account_id.toString();

  res.locals.permission = permission;
  res.locals.meta = meta;

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
  const permission = res.locals.permission;
  const permissionType = permission.type || 'public';
  const accountId = permission.account_id;
  const meta = res.locals.meta;
  let service_data;

  createSwipesShortUrl({ userId, accountId, link, checksum, meta })
    .then(({serviceData, checksum}) => {
      const permission = {
        type: 'public',
        account_id: accountId
      }

      service_data = serviceData;

      return addPermissionsToALink({ userId, checksum, permission })
    })
    .then(({ permissionPart }) => {
      const short_url = permissionPart;

      return res.status(200).json({ok: true, short_url, service_data});
    })
    .catch((err) => {
      return next(err);
    })
});

module.exports = router;
