"use strict";

const express = require('express');
const validator = require('validator');
import {
  createSwipesShortUrl
} from '../utils/share_url_util'

const router = express.Router();

const validateData = (req, res, next) => {
  // That validation tho!
  const accountId = req.body.account_id.toString();
  const service = req.body.service;

  service.name = service.name.toString();
  service.type = service.type.toString();
  service.item_id = service.item_id.toString();

  res.locals.accountId = accountId;
  res.locals.service = service;

  return next();
}

/**
  example
  {JSON} service
  {
    name: "service_name",
    account_id: "Service account id",
    type: "tasks",
    item_id: "ID of tasks"
  },
  {
    link: {
      service: 'slack',
      type: 'task / message / email / file',
      id: 'T123A'
    },
    meta: {
      // Swipes Card properties
    },
    access: {
      permission: 'public',
      user_id: 'swipes user id'
      account_id: 'service account id - to use from swipes'
    }
  }

**/
router.post('/link.add', validateData, (req, res, next) => {
  const userId = req.userId;
  const service = res.locals.service;
  const accountId = res.locals.accountId;

  createSwipesShortUrl({ userId, accountId, service })
    .then((shortUrl) => {
      return res.status(200).json({ok: true, short_url: shortUrl});
    })
    .catch((err) => {
      return next(e);
    })
});

module.exports = router;
