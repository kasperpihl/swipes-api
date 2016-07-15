import config from 'config';
import rp from 'request-promise';
import querystring from 'querystring';
import r from 'rethinkdb';
import db from '../db.js';
import SwipesError from '../swipes-error.js';

const xendoConfig = config.get('xendo');

const xendoCredentials = (req, res, next) => {
  const query = r.table('config').getAll('xendo', {index: 'key'}).nth(0);

  db.rethinkQuery(query)
    .then((result) => {
      if (!result) {
        return next('Need to add credentials to the db!!!');
      }

      res.locals.xendoCredentials = result;

      return next();
    })
    .catch((error) => {
      return next(error);
    })
}

const xendoUserSignUp = (req, res, next) => {
  const {
    userId,
    xendoCredentials
  } = res.locals;
  const xendoEmail = userId + '@swipesapp.com';
  const qs = querystring.stringify({
    email: xendoEmail,
    username: xendoEmail,
    client_id: xendoConfig.clientId,
    client_secret: xendoConfig.clientSecret
  });
  const url = xendoConfig.addUserEndpoint + '?' + qs;

  rp.get(url, {
    auth: {
      bearer: xendoCredentials.access_token
    }
  })
  .then((xendoResult) => {
    if (xendoResult.error) {
      return next(xendoResult.error);
    }


    const updateSwipesUserQ = r.table('users').get(userId).update({
      xendoCredentials: JSON.parse(xendoResult)
    });

    return db.rethinkQuery(updateSwipesUserQ);
  })
  .then(() => {
    return next();
  })
  .catch((error) => {
    return next(error);
  })
}

const xendoAddServiceToUser = (req, res, next) => {
  const userId = req.userId;
  const {
    xendoCredentials,
    serviceToAppend
  } = res.locals;
  const xendoEmail = userId + '@swipesapp.com';
  const qs = querystring.stringify({
    email: xendoEmail,
    service_name: serviceToAppend.service_name,
    access_token: serviceToAppend.authData.access_token,
    refresh_token: serviceToAppend.authData.refresh_token,
    // client_id: xendoConfig.clientId,
    // client_secret: xendoConfig.clientSecret
  });
  const url = xendoConfig.addServiceToUserEndpoint + '?' + qs;

  rp.get(url, {
    auth: {
      bearer: xendoCredentials.access_token
    }
  })
  .then((something) => {
    console.log(something); // I just want to see what will this return. Someday maybe :/
    return next();
  })
  .catch((error) => {
    return next(error);
  })
}

export {
  xendoCredentials,
  xendoUserSignUp,
  xendoAddServiceToUser
}
