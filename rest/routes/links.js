"use strict";

const config = require('config');
const express = require( 'express' );
const r = require('rethinkdb');
const Promise = require('bluebird');
const validator = require('validator');
const shortid = require('shortid');
const hash = require('object-hash');
const util = require('../util.js');
const db = require('../db.js');
const SwipesError = require( '../swipes-error' );

const generateId = util.generateSlackLikeId;
const router = express.Router();

/**
  example
  {JSON} service
  {
    name: 'asana',
    method: 'tasks.findById',
    data: {id: '1234567'},
    // Fields is for mapping from the API result
    fields: {
      title: name,
      description: notes
    },
    actions: {
      title: 'complete',
      icon: 'check',
      method: 'tasks.update',
      data: {
        id: '1234567',
        completed: true
      }
    }
  }
**/
router.post('/link.add', (req, res, next) => {
  const service = req.body.service;
  const method = req.body.method;
  const data = req.body.data;
  const fields = req.body.fields;
  const actions = req.body.actions;

  //T_TODO validating the service object

  // T_TODO check for a the checksum
  // if it there just return the url without making a new one
  const checksum = hash(service);
  const shortUrl = 'SW-' + shortid.generate();
  const link = {
    checksum: checksum,
    service: service,
    shortUrl: shortUrl
  };

  const insertLinkQ = r.table('links').insert(link);

  db.rethinkQuery(insertLinkQ)
    .then(() => {
      return res.status(200).json({ok: true});
    })
    .catch((e) => {
      return next(e);
    })
});

module.exports = router;
