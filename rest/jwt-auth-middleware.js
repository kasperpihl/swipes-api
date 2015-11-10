"use strict";

let jwt = require('jwt-simple');
let config = require('config');

let restAuth = (req, res, next) => {
  let token = req.body && req.body.token;

  if (token) {
    try {
      let decoded = jwt.decode(token, config.get('jwtTokenSecret'));

      req.userId = decoded.iss;
      req.isAdmin = decoded.adm;
      next();
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
