var express = require( 'express' );
var r = require('rethinkdb');
var moment = require('moment');
var validator = require('validator');
var sha1 = require('sha1');
var util = require('../util.js');
var db = require('../db.js');
var generateId = util.generateSlackLikeId;

var router = express.Router();

router.get('/users.list', function (req, res, next) {
  var query = r.table('users');

  db.rethinkQuery(query)
    .then(function (results) {
        res.status(200).json({ok: true, results: results});
    }).catch(function (err) {
      return next(err);
    });
});

module.exports = router;
