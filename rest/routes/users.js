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

router.post('/users.create', function (req, res, next) {
  var email = validator.trim(req.body.email);
  var username = validator.trim(req.body.username);
  var password = validator.trim(req.body.password);
  var repassword = validator.trim(req.body.repassword);

  if (!validator.isEmail(email)) {
    return res.status(409).json({err: 'Ivalid email!'});
  }

  if (validator.isNull(username)) {
    return res.status(409).json({err: 'The username cannot be empty!'});
  }

  if (validator.isNull(password)) {
    return res.status(409).json({err: 'The password cannot be empty!'});
  }

  if (!validator.equals(password, repassword)) {
    return res.status(409).json({err: 'The passwords must match!'});
  }

  var doc = {
    id: generateId("U"),
    email: email,
    username: username,
    password: sha1(password),
    created: moment().unix()
  }

  var query = r.table('organizations').coerceTo('array').do(
    function (organizations) {
      return r.branch(
        r.table('users').getAll(doc.email, {index: 'email'}).isEmpty(),
        r.table('users').insert(
          r.expr(doc).merge(
            {'organizationId': r.db("swipes").table('organizations').limit(1)("id").nth(0)}
          )
        ),
        {}
      );
    }
  );

  db.rethinkQuery(query)
    .then(function (results) {
      if (util.isEmpty(results)) {
        res.status(409).json({err: 'There is a user with that email.'});
      } else {
        res.status(200).json({ok: true});
      }
    }).catch(function (err) {
      return next(err);
    });
});

module.exports = router;
