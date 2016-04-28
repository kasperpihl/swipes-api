"use strict";

let jwt = require('jwt-simple');
let config = require('config');
let db = require('./db.js');
let r = require('rethinkdb');

let restAuth = (req, res, next) => {
  let token = req.body && req.body.token || req.query && req.query.token;

  if (token) {
    try {
      let decoded = jwt.decode(token, config.get('jwtTokenSecret'));

      req.userId = decoded.iss;
      req.isAdmin = decoded.adm;
      req.isSysAdmin = decoded.sysAdm;

      db.rethinkQuery(r.table('users').get(req.userId).without('password'))
        .then((user) => {
          // Create scopes that a user can save/read from
          var scopes = [ req.userId ];
          if(!user)
            return res.status(200).json({ok: false, err: 'not_authed'});

          // Finding apps that a user have access to
          if(user.apps){
            for( var i = 0 ; i < user.apps.length ; i++ ){
              var app = user.apps[i];
              scopes.push(app.id);
            }
          }

          req.scopes = scopes;
          req.user = user;

          next()
        }).catch((err) => {
          return next(err);
        });
    } catch (err) {
      res.status(200).json({ok: false, err: 'not_authed'});
    }
  } else {
    res.status(200).json({ok: false, err: 'not_authed'});
  }
}

let ioAuth = (req, res, next) => {
  let token = req._query && req._query.token;

  if (token) {
    try {
      let decoded = jwt.decode(token, config.get('jwtTokenSecret'));

      req.userId = decoded.iss;
      next();
    } catch (err) {
      console.log(err);
      console.log('Can\'t parse the token!');
      next();
    }
  } else {
    console.log('No token passed!');
    next();
  }
}

module.exports = {
  restAuth: restAuth,
  ioAuth: ioAuth
}
