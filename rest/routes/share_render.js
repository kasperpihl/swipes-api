"use strict";

const r = require('rethinkdb');
const Promise = require('bluebird');
const db = require('../db.js');

const express = require('express');
const router = express.Router();

import fs from 'fs';
import path from 'path';
const indexPath = path.join(__dirname, '../../webapp/dist/index.html');

router.get('/*', (req, res, next) => {
  const pathParts = req.originalUrl.split('/');
  const shareId = pathParts[2];
  const getSwipesUrlsQ =
    r.db('swipes').table('links_permissions')
      .getAll(shareId)
      .eqJoin('link_id', r.db('swipes').table('links'))
      .map((doc) => {
        return {
          left: doc('left').without('link_id'),
          right: doc('right').without('id', 'type', 'short_url')
        }
      })
      .zip()
      .map((link) => {
        return link.merge(() => {
          return {"short_url": link('id')}
        })
      })
      .without('id')
  //const getSwipesUrlQ = r.table('links').getAll(shareId, {index: 'short_url'}).nth(0).without('checksum', 'id', 'userId', 'service');


  db.rethinkQuery(getSwipesUrlsQ)
    .then((data) => {
      console.log('data found in share render', data);
      if (data && data[0]) {
        res.send(renderIndex(data[0]));
      }
    })
    .catch((e) => {
      return next(e);
    })
})

const renderIndex = (data) => {
  let indexHtml;
  try {
    indexHtml = fs.readFileSync(indexPath, 'utf8');
    data = JSON.stringify(data);
  }
  catch (e) {
    //T_TODO better error handling
    console.log(e);
  }

  const firstJsTagIndex = indexHtml.indexOf('<script type="text/javascript">');
  const embededScript = '<script type="text/javascript">window.__share_data = ' + data + ';</script>'

  return [indexHtml.slice(0, firstJsTagIndex), embededScript, indexHtml.slice(firstJsTagIndex)].join('');
}

module.exports = router;
