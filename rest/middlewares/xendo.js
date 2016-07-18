import config from 'config';
import rp from 'request-promise';
import querystring from 'querystring';
import r from 'rethinkdb';
import db from '../db.js';
import SwipesError from '../swipes-error.js';

const xendoConfig = config.get('xendo');

const xendoRefreshSwipesToken = (req, res, next) => {
  // TODO check the expire time and don't refresh the token evetytime
  const {
    xendoSwipesCredentials
  } = res.locals;
  const options = {
    method: 'POST',
    uri: xendoConfig.accessTokenEndpoint,
    form: {
      grant_type: 'refresh_token',
      client_id: xendoConfig.clientId,
      client_secret: xendoConfig.clientSecret,
      refresh_token: xendoSwipesCredentials.refresh_token
    }
  }

  rp.post(options)
    .then((result) => {
      const newConfig = JSON.parse(result);
      const query =
        r.table('config')
          .getAll('xendo', {index: 'key'})
          .nth(0)
          .update(newConfig);

      res.locals.xendoSwipesCredentials = newConfig;

      return db.rethinkQuery(query);
    })
    .then(() => {
      return next();
    })
    .catch((error) => {
      return next(error);
    })
}

const xendoSwipesCredentials = (req, res, next) => {
  const query = r.table('config').getAll('xendo', {index: 'key'}).nth(0);

  db.rethinkQuery(query)
    .then((result) => {
      if (!result) {
        return next('Need to add credentials to the db!!!');
      }

      res.locals.xendoSwipesCredentials = result;

      return next();
    })
    .catch((error) => {
      return next(error);
    })
}

const xendoUserCredentials = (req, res, next) => {
  const userId = req.userId;
  const query = r.table('users').get(userId);

  db.rethinkQuery(query)
    .then((result) => {
      if (!result) {
        return next('Invalid userId :/');
      }

      res.locals.xendoUserCredentials = result.xendoCredentials;

      return next();
    })
    .catch((error) => {
      return next(error);
    })
}

const xendoUserSignUp = (req, res, next) => {
  const {
    userId,
    xendoSwipesCredentials
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
      bearer: xendoSwipesCredentials.access_token
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
    xendoSwipesCredentials,
    serviceToAppend
  } = res.locals;
  const xendoEmail = userId + '@swipesapp.com';
  const qs = querystring.stringify({
    email: xendoEmail,
    service_name: serviceToAppend.service_name,
    access_token: serviceToAppend.authData.access_token,
    refresh_token: serviceToAppend.authData.refresh_token
  });
  const url = xendoConfig.addServiceToUserEndpoint + '?' + qs;

  rp.get(url, {
    auth: {
      bearer: xendoSwipesCredentials.access_token
    }
  })
  .then((result) => {
    result = JSON.parse(result);

    if (result.error) {
      return next(result.error);
    }

    console.log(result); // I just want to see what will this return. Someday maybe :/
    return next();
  })
  .catch((error) => {
    return next(error);
  })
}

const xendoSearch = (req, res, next) => {
  const {
    xendoUserCredentials,
    query
  } = res.locals;
  const qs = querystring.stringify({
    q: query
  });
  const url = xendoConfig.searchEndpoint + '?' + qs;

  rp.get(url, {
    auth: {
      bearer: xendoUserCredentials.access_token
    }
  })
  .then((result) => {
    res.locals.result;

    return next();
  })
  .catch((error) => {
    return next(error);
  })

  return next();
}

export {
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserCredentials,
  xendoUserSignUp,
  xendoAddServiceToUser,
  xendoSearch
}
