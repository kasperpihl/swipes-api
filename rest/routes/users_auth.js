var express = require( 'express' );
var r = require('rethinkdb');
var validator = require('validator');
var sha1 = require('sha1');
var util = require('../util.js');
var db = require('../db.js');

var router = express.Router();

router.get('/users.logged', function (req, res, next) {
  if (!req.session.userId) {
    res.status(400).json({err: 'Not logged in.'});
  } else {
    res.status(200).json({ok: true});
  }
});

router.get('/users.logout', function (req, res, next) {
  delete req.session.userId;

  res.status(200).json({ok: true});
});

router.post('/users.login', function (req, res, next) {
  var email = validator.trim(req.body.email);
  var password = req.body.password
    ? sha1(req.body.password)
    : ''

  if (!validator.isEmail(email)) {
    return res.status(409).json({err: 'Ivalid email!'});
  }

  var query = r.table('users').filter({
    email: email,
    password: password
  }).withFields('id');

  db.rethinkQuery(query)
    .then(function (results) {
      if (results.length === 0) {
        res.status(409).json({err: 'Incorrect email or password.'});
      } else {
        var userId = results[0].id

        req.session.userId = userId;
        res.status(200).json({ok: true});
      }
    }).catch(function (err) {
      return next(err);
    });
});

module.exports = router;
