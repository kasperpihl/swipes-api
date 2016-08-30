"use strict";

const express = require('express');
const validator = require('validator');
import SwipesError from '../swipes-error.js';
import {
  createSwipesShortUrl
} from '../utils/share_url_util'

const router = express.Router();

const validateData = (req, res, next) => {
  const link = req.body.link;
  const permission = req.body.permission;
  const meta = req.body.meta || null;

  if (validator.isNull(link) || validator.isNull(permission)) {
    return next(new SwipesError('link and permission are required'));
  }

  if (validator.isNull(link.service) ||
      validator.isNull(link.type) ||
      validator.isNull(link.id)) {
    return next(new SwipesError('service, type and id of link are required'));
  }

  if (validator.isNull(permission.type) ||
      validator.isNull(permission.account_id)) {
    return next(new SwipesError('type, account_id of permission are required'));
  }

  if (meta && meta.data && !meta.data.title) {
    return next(new SwipesError('meta.title is required'));
  }

  link.service = link.service.toString();
  link.type = link.type.toString();
  link.id = link.id.toString();
  permission.type = permission.type.toString();
  permission.account_id = permission.account_id.toString();

  res.locals.link = link;
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
  const link = res.locals.link;
  const permission = res.locals.permission;
  const accountId = permission.account_id;
  const meta = res.locals.meta;

  createSwipesShortUrl({ userId, accountId, link, meta })
    .then(({shortUrl, serviceData}) => {
      return res.status(200).json({ok: true, short_url: shortUrl, service_data: serviceData});
    })
    .catch((err) => {
      return next(err);
    })
});

module.exports = router;
