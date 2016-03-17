"use strict";

let express = require( 'express' );
let r = require('rethinkdb');
let validator = require('validator');
let sha1 = require('sha1');
let moment = require('moment');
let jwt = require('jwt-simple');
let config = require('config');
let util = require('../util.js');
let db = require('../db.js');
let generateId = util.generateSlackLikeId;

let router = express.Router();

router.post('/users.login', (req, res, next) => {
  let email = req.body.email ? validator.trim(req.body.email.toLowerCase()) : '';
  let password = req.body.password ? sha1(req.body.password) : '';

  if (!validator.isEmail(email)) {
    return res.status(200).json({
      ok: false,
      err: 'Invalid email!',
      errors: [{field: 'email', message: 'Invalid email!'}]
    });
  }

  let query = r.table('users').filter({
    email: email
  }).map((user) => {
    return {
      id: user('id'),
      password: user('password'),
      is_admin: user("is_admin").default(false)
    }
  });

  db.rethinkQuery(query)
    .then((users) => {
      let user = users[0];

      if (users.length === 0) {
        res.status(200).json({
          ok: false,
          err: 'Incorrect email.',
          errors: [{field: 'email', message: 'Incorrect email.'}]
        });
      } else if (password !== user.password) {
        res.status(200).json({
          ok: false,
          err: 'Incorrect password.',
          errors: [{field: 'password', message: 'Incorrect password.'}]
        });
      } else {
        let token = jwt.encode({
          iss: user.id,
          adm: user.is_admin,
          sysAdm: user.is_sysadmin
        }, config.get('jwtTokenSecret'))

        res.status(200).json({ok: true, token: token});
      }
    }).catch((err) => {
      return next(err);
    });
});

router.post('/users.create', (req, res, next) => {
  let email = req.body.email ? validator.trim(req.body.email.toLowerCase()) : '';
  let name = validator.trim(req.body.name);
  let password = req.body.password;
  let repassword = req.body.repassword;
  let errors = [];

  if (!validator.isEmail(email)) {
    errors.push({
      field: 'email',
      message: 'Ivalid email!'
    });
  }

  if (validator.isNull(name)) {
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
    return res.status(200).json({
      ok: false,
      err: errors[0].message,
      errors: errors
    });
  }

  let userId = generateId("U");

  let userDoc = {
    id: userId,
    apps: [],
    services:[],
    organizations: [],
    email: email,
    name: name,
    password: sha1(password),
    created: moment().unix(),
    team: 'swipes'
  }

  let checkQ = r.do(
    r.table('users').getAll(userDoc.email, {index: 'email'}).isEmpty(),
    r.table('users').getAll(userDoc.name, {index: 'name'}).isEmpty(),
    (isEmail, isName) => {
      return r.expr([isEmail, isName])
    }
  )

  let insertUserQ = r.table('users').insert(userDoc)

  db.rethinkQuery(checkQ)
    .then((results) => {
      if (!results[0]) {
        res.status(200).json({
          ok: false,
          err: 'There is a user with that email.',
          errors: [{field: 'email', message: 'There is a user with that email.'}]
        });
      } else if (!results[1]) {
        res.status(200).json({
          ok: false,
          err: 'This username is not available.',
          errors: [{field: 'username', message: 'This username is not available.'}]
        });
      } else {
        db.rethinkQuery(insertUserQ)
          .then(() => {
            let token = jwt.encode({
              iss: userId
            }, config.get('jwtTokenSecret'))

            res.status(200).json({ok: true, token: token});
          }).catch((err) => {
            return next(err);
          });
      }
    }).catch((err) => {
      return next(err);
    });
});

module.exports = router;
