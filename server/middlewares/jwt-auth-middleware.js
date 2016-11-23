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

      req.userId = decoded.iss;
      req.isAdmin = decoded.adm;
      req.isSysAdmin = decoded.sysAdm;

      db.rethinkQuery(r.table('users').get(req.userId).without('password'))
        .then((user) => {
          // Create scopes that a user can save/read from
          const scopes = [ req.userId ];
          if(!user)
            return res.status(200).json({ok: false, err: 'not_authed'});

          // Finding apps that a user have access to
          if (user.apps) {
            for( var i = 0 ; i < user.apps.length ; i++ ){
              const app = user.apps[i];
              scopes.push(app.id);
            }
          }

          req.scopes = scopes;
          req.user = user;

          return next();
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

export {
  restAuth
}
