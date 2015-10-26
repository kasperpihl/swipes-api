"use strict";

const TEAM_ID = process.env.TEAM_ID;

var express = require( 'express' );
var r = require('rethinkdb');
var validator = require('validator');
var sha1 = require('sha1');
var moment = require('moment');
var util = require('../util.js');
var db = require('../db.js');
var generateId = util.generateSlackLikeId;

var router = express.Router();

router.get('/users.logged', function (req, res, next) {
  if (!req.session.userId) {
    res.status(400).json({errors: [{message: 'Not logged in.'}]});
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
  var password = req.body.password ? sha1(req.body.password) : '';

  if (!validator.isEmail(email)) {
    return res.status(409).json({ok:false,errors: [{field: 'email', message: 'Invalid email!'}]});
  }

  var query = r.table('users').filter({
    email: email
  }).withFields('id', 'password');

  db.rethinkQuery(query)
    .then(function (results) {
      if (results.length === 0) {
        res.status(409).json({errors: [{field: 'email', message: 'Incorrect email.'}]});
      } else if (password !== results[0].password) {
        res.status(409).json({errors: [{field: 'password', message: 'Incorrect password.'}]});
      } else {
        var userId = results[0].id

        req.session.userId = userId;
        res.status(200).json({ok: true});
      }
    }).catch(function (err) {
      return next(err);
    });
});

router.post('/users.create', function (req, res, next) {
  var email = validator.trim(req.body.email);
  var username = validator.trim(req.body.username);
  var password = req.body.password;
  var repassword = req.body.repassword;
  var errors = [];

  if (!validator.isEmail(email)) {
    errors.push({
      field: 'email',
      message: 'Ivalid email!'
    });
  }

  if (validator.isNull(username)) {
    errors.push({
      field: 'username',
      message: 'The username cannot be empty!'
    });
  }

  if (validator.isNull(password)) {
    errors.push({
      field: 'password',
      message: 'The password cannot be empty!'
    });
  }

  if (!validator.equals(password, repassword)) {
    errors.push({
      field: 'repassword',
      message: 'The passwords must match!'
    });
  }

  if (errors.length > 0) {
    return res.status(409).json({errors: errors});
  }

  var userId = generateId("U");
  var teamId = generateId("T");

  var userDoc = {
    id: userId,
    email: email,
    username: username,
    password: sha1(password),
    created: moment().unix()
  }

  var insertUser =
    r.table('channels')
      .filter((doc) => {
        return doc('is_general').eq(true)
      })
      .coerceTo('array')
      .do((channel) => {
        return r.table('users')
          .insert(
            r.expr(userDoc)
              .merge(
                {channels: channel('id')}
              )
          )
      })
      
  var appendUserToTeam = r.table('teams').get(TEAM_ID).update({
    users: r.row('users').append(userId)
  });

  var query = r.branch(
    r.table('users').getAll(userDoc.email, {index: 'email'}).isEmpty(),
    r.do(insertUser),
    {}
  );

  db.rethinkQuery(query)
    .then(function (results) {
      if (util.isEmpty(results)) {
        res.status(409).json({
          errors: [{field: 'email', message: 'There is a user with that email.'}]
        });
      } else {
        db.rethinkQuery(appendUserToTeam)
          .then(function () {
            req.session.userId = userId;
            res.status(200).json({ok: true});
          }).catch(function (err) {
            return next(err);
          });
      }
    }).catch(function (err) {
      return next(err);
    });
});

module.exports = router;
