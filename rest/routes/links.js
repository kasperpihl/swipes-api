"use strict";

const config = require('config');
const express = require('express');
const r = require('rethinkdb');
const Promise = require('bluebird');
const validator = require('validator');
const shortid = require('shortid');
const hash = require('object-hash');
const util = require('../util.js');
const db = require('../db.js');
const SwipesError = require('../swipes-error');

const generateId = util.generateSlackLikeId;
const router = express.Router();

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
router.post('/link.add', (req, res, next) => {
  const userId = req.userId;
  //T_TODO validating the service object
  const service = req.body.service;
  const checksum = hash({service: service, userId: userId});
  const checkSumQ = r.table('links').getAll(checksum, {index: 'checksum'});

  let shortUrl = null;

  db.rethinkQuery(checkSumQ)
    .then((res) => {
      if (res.length > 0) {
        shortUrl = res[0].short_url;

        return Promise.resolve();
      }

      shortUrl = shortid.generate();
      const link = {
        checksum: checksum,
        service: service,
        short_url: shortUrl,
        userId: userId
      };

      const insertLinkQ = r.table('links').insert(link);

      return db.rethinkQuery(insertLinkQ);
    })
    .then(() => {
      return res.status(200).json({ok: true, short_url: shortUrl});
    })
    .catch((e) => {
      return next(e);
    })
});

module.exports = router;
