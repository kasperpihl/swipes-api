"use strict";

const TEAM_ID = process.env.TEAM_ID;

let express = require( 'express' );
let r = require('rethinkdb');
let validator = require('validator');
let sha1 = require('sha1');
let moment = require('moment');
let util = require('../util.js');
let db = require('../db.js');
let generateId = util.generateSlackLikeId;

let router = express.Router();

router.get('/users.logged', (req, res, next) => {
  if (!req.session.userId) {
    res.status(400).json({errors: [{message: 'Not logged in.'}]});
  } else {
    res.status(200).json({ok: true});
  }
});

router.get('/users.logout', (req, res, next) => {
  delete req.session.userId;

  res.status(200).json({ok: true});
});

router.post('/users.login', (req, res, next) => {
  let email = validator.trim(req.body.email);
  let password = req.body.password ? sha1(req.body.password) : '';

  if (!validator.isEmail(email)) {
    return res.status(409).json({ok:false,errors: [{field: 'email', message: 'Invalid email!'}]});
  }

  let query = r.table('users').filter({
    email: email
  }).withFields('id', 'password');

  db.rethinkQuery(query)
    .then((results) => {
      if (results.length === 0) {
        res.status(409).json({errors: [{field: 'email', message: 'Incorrect email.'}]});
      } else if (password !== results[0].password) {
        res.status(409).json({errors: [{field: 'password', message: 'Incorrect password.'}]});
      } else {
        let userId = results[0].id

        req.session.userId = userId;
        res.status(200).json({ok: true});
      }
    }).catch((err) => {
      return next(err);
    });
});

router.post('/users.create', (req, res, next) => {
  let email = validator.trim(req.body.email);
  let username = validator.trim(req.body.username);
  let password = req.body.password;
  let repassword = req.body.repassword;
  let errors = [];

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

  let userId = generateId("U");
  let teamId = generateId("T");

  let userDoc = {
    id: userId,
    email: email,
    username: username,
    password: sha1(password),
    created: moment().unix()
  }

  let checkQ = r.do(
    r.table('users').getAll(userDoc.email, {index: 'email'}).isEmpty(),
    r.table('users').getAll(userDoc.username, {index: 'username'}).isEmpty(),
    (isEmail, isUsername) => {
      return r.expr([isEmail, isUsername])
    }
  )

  let insertUserQ =
    r.table('channels')
      .filter((doc) => {
        return doc('is_general').eq(true)
      })
      .coerceTo('array')
      .do((channel) => {
        return r.table('users')
          .insert(
            r.expr(userDoc)
              .merge({
                channels: [
                  {
                    id: channel('id').nth(0),
                    last_read: 123 // long long ago :D :D
                  }
                ]
              })
          )
      })

  let appendUserToTeamQ = r.table('teams').get(TEAM_ID).update((team) => {
    return {
      users: team('users').append(userId)
    }
  });

  let insertUpdateQ =
    r.do(
      insertUserQ,
      appendUserToTeamQ
    )

  db.rethinkQuery(checkQ)
    .then((results) => {
      if (!results[0]) {
        res.status(409).json({
          errors: [{field: 'email', message: 'There is a user with that email.'}]
        });
      } else if (!results[1]) {
        res.status(409).json({
          errors: [{field: 'username', message: 'This username is not available.'}]
        });
      } else {
        db.rethinkQuery(insertUpdateQ)
          .then(() => {
            req.session.userId = userId;
            res.status(200).json({ok: true});
          }).catch((err) => {
            return next(err);
          });
      }
    }).catch((err) => {
      return next(err);
    });
});

module.exports = router;
