"use strict";

const TEAM_ID = process.env.TEAM_ID;

var express = require( 'express' );
var getSlug = require('speakingurl');
var r = require('rethinkdb');
var moment = require('moment');
var validator = require('validator');
var util = require('../util.js');
var db = require('../db.js');
var generateId = util.generateSlackLikeId;

var router = express.Router();

router.get('/channels.list', function (req, res, next) {
  var query = r.table('channels');

  db.rethinkQuery(query)
    .then(function (results) {
        res.status(200).json({ok: true, results: results});
    }).catch(function (err) {
      return next(err);
    });
});

router.post('/channels.history', function (req, res, next) {
  // T_TODO check if that user is part of the channel
  // and ofc some validation for the required params
  var channel_id = req.body.channel_id;
  var count = req.body.count || 50;

  var query =
    r.table('messages')
      .filter({channel_id: channel_id})
      .limit(count)
      .orderBy('ts');

  db.rethinkQuery(query)
    .then(function (results) {
        res.status(200).json({ok: true, results: results});
    }).catch(function (err) {
      return next(err);
    });
});

router.post('/channels.create', function (req, res, next) {
  var doc = {};
  var name = getSlug(validator.trim(req.body.name));

  if (validator.isNull(name)) {
    return res.status(409).json({err: 'The name cannot be empty!'});
  }

  doc.id = generateId('C');
  doc.name = name;
  doc.is_archived = false;
  doc.created = moment().unix();
  doc.teamId = TEAM_ID;

  var query = r.branch(
          r.table('channels').getAll(doc.name, {index: 'name'}).isEmpty(),
          r.table('channels').insert(doc),
          {}
        );

  db.rethinkQuery(query)
    .then(function (results) {
      if (util.isEmpty(results)) {
        res.status(409).json({err: 'There is a channel with that name.'});
      } else {
        res.status(200).json({ok: true});
      }
    }).catch(function (err) {
      return next(err);
    });
});

router.post('/channels.rename', function (req, res, next) {
  var id = req.body.channel_id;
  var name = getSlug(validator.trim(req.body.name));

  if (validator.isNull(id)) {
    return res.status(409).json({err: 'Id is required!'});
  }

  if (validator.isNull(name)) {
    return res.status(409).json({err: 'The name cannot be empty!'});
  }

  var query = r.table('channels').get(id).update({name: name});

  db.rethinkQuery(query)
    .then(function (results) {
      res.status(200).json({ok: true});
    }).catch(function (err) {
      return next(err);
    });
});

router.post('/channels.archive', function (req, res, next) {
  var id = req.body.channel_id;
  var query = r.table('channels').get(id).update({is_archived: true});

  db.rethinkQuery(query)
    .then(function (results) {
      res.status(200).json({ok: true});
    }).catch(function (err) {
      return next(err);
    });
});

router.post('/channels.unarchive', function (req, res, next) {
  var id = req.body.channel_id;
  var query = r.table('channels').get(id).update({is_archived: false});

  db.rethinkQuery(query)
    .then(function (results) {
      res.status(200).json({ok: true});
    }).catch(function (err) {
      return next(err);
    });
});

router.post('/channels.delete', function (req, res, next) {
  var id = req.body.channel_id;
  var query = r.table('channels').get(id).update({deleted: true});

  db.rethinkQuery(query)
    .then(function (results) {
      res.status(200).json({ok: true});
    }).catch(function (err) {
      return next(err);
    });
});

module.exports = router;
