"use strict";

const express = require('express');
const validator = require('validator');
import {
  createSwipesShortUrl
} from '../utils/share_url_util'

const router = express.Router();

const validateData = (req, res, next) => {
  const service = req.body.service;

  // That validation tho!
  service.name = service.name.toString();
  service.account_id = service.account_id.toString();
  service.type = service.type.toString();
  service.item_id = service.item_id.toString();

  res.locals.service = service;

  return next();
}

/**
  example
  {JSON} service
  {
    name: "service_name"
    account_id: "Service account id",
    type: "tasks",
    item_id: "ID of tasks"
  }
**/
router.post('/link.add', validateData, (req, res, next) => {
  const userId = req.userId;
  const service = res.locals.service;

  createSwipesShortUrl({ userId, service })
    .then((shortUrl) => {
      return res.status(200).json({ok: true, short_url: shortUrl});
    })
    .catch((err) => {
      return next(e);
    })
});

module.exports = router;
