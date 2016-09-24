"use strict";

import config from 'config';
import express from 'express';
import r from 'rethinkdb';
import db from '../db.js';

const serviceDir = __dirname + '/../../services/';
const router = express.Router();

router.post('/share.getData', (req, res, next) => {
  const shareIds = req.body.shareIds;
  const getSwipesUrlsQ =
    r.db('swipes').table('links_permissions')
      .getAll(r.args(shareIds))
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

  db.rethinkQuery(getSwipesUrlsQ)
    .then((links) => {
      const mappedLinks = shareIds.map((id) => {
        const linksLen = links.length;
        let link = {};

        for (let i=0; i<linksLen; i++) {
          if (links[i].short_url === id) {
            link = links[i];
            break;
          }
        }

        return link;
      })

      return res.status(200).json({ok: true, links: mappedLinks});
    })
    .catch((err) => {
      return res.status(200).json({ok: false, err});
    })
})

router.post('/share.getPreview', (req, res, next) => {
  const shareId = req.body.shareId;
  const getSwipesUrlsQ =
    r.db('swipes').table('links_permissions')
      .getAll(shareId)
      .eqJoin('link_id', r.db('swipes').table('links'))
      .map((doc) => {
        return {
          left: doc('left').without('link_id'),
          right: doc('right').merge({
            item_id: doc('right')('id')
          })
          .without('id', 'short_url')
        }
      })
      .zip()
      .map((link) => {
        return link.merge(() => {
          return {"short_url": link('id')}
        })
      })
      .without('id')

  db.rethinkQuery(getSwipesUrlsQ)
    .then((links) => {
      const link = links[0];

      return res.status(200).json({ok: true, link});
    })
    .catch((err) => {
      return res.status(200).json({ok: false, err});
    })
})

module.exports = router;
