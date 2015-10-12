var express = require( 'express' );
var getSlug = require('speakingurl');
var r = require('rethinkdb');
var moment = require('moment');
var util = require('../util.js');
var db = require('../db.js');
var generateId = util.generateSlackLikeId;

var router = express.Router();

router.get('/channels.list', function (req, res, next) {
  var query = r.table("channels");

  db.rethinkQuery(query)
    .then(function (results) {
        res.status(200).json({ok: true, results: results});
    }).catch(function (err) {
      return next(err);
    });
});

router.post('/channels.create', function (req, res, next) {
  var doc = {};

  doc.id = generateId('C');
  doc.name = getSlug(req.body.name);
  doc.is_archived = false;
  doc.created = moment().unix();

  var query = r.branch(
          r.table("channels").getAll(doc.name, {index: "name"}).isEmpty(),
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

router.post('/channels.archive', function (req, res, next) {
  var id = req.body.id;
  var query = r.table("channels").get(id).update({is_archived: true});

  db.rethinkQuery(query)
    .then(function (results) {
      res.status(200).json({ok: true});
    }).catch(function (err) {
      return next(err);
    });
});

router.post('/channels.unarchive', function (req, res, next) {
  var id = req.body.id;
  var query = r.table("channels").get(id).update({is_archived: false});

  db.rethinkQuery(query)
    .then(function (results) {
      res.status(200).json({ok: true});
    }).catch(function (err) {
      return next(err);
    });
});

module.exports = router;
