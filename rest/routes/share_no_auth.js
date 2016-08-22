"use strict";

import config from 'config';
import express from 'express';
import r from 'rethinkdb';
import db from '../db.js';

const serviceDir = __dirname + '/../../services/';
const router = express.Router();

router.post('/share.getData', (req, res, next) => {
  const shareIds = req.body.shareIds;

  const getSwipesUrlsQ = r.table('links').getAll(r.args(shareIds), {index: 'short_url'});

  db.rethinkQuery(getSwipesUrlsQ)
    .then((links) => {
      return res.status(200).json({ok: true, links});
    })
    .catch((err) => {
      return res.status(200).json({ok: false, err});
    })
})

module.exports = router;
