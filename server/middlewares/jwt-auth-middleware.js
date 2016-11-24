"use strict";

import jwt from 'jwt-simple';
import config from 'config';
import r from 'rethinkdb';
import db from '../db';

const restAuth = (req, res, next) => {
  const token = res.locals.token;

  if (token) {
    try {
      const decoded = jwt.decode(token, config.get('jwtTokenSecret'));
      const user_id = decoded.iss;

      res.locals.user_id = user_id;

      return next();
    } catch (err) {
      res.status(200).json({ok: false, err: 'not_authed'});
    }
  } else {
    res.status(200).json({ok: false, err: 'not_authed'});
  }
}

export {
  restAuth
}
