import config from 'config';
import rp from 'request-promise';
import request from 'request';
import querystring from 'querystring';
import r from 'rethinkdb';
import db from '../db.js';
import SwipesError from '../swipes-error.js';

const xendoConfig = config.get('xendo');

const xendoRefreshSwipesToken = (req, res, next) => {
  // TODO check the expire time and don't refresh the token everytime
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

const xendoRefreshUserToken = (req, res, next) => {
  // TODO check the expire time and don't refresh the token everytime
  const userId = req.userId;
  const {
    xendoUserCredentials
  } = res.locals;
  const options = {
    method: 'POST',
    uri: xendoConfig.accessTokenEndpoint,
    form: {
      grant_type: 'refresh_token',
      client_id: xendoConfig.clientId,
      client_secret: xendoConfig.clientSecret,
      refresh_token: xendoUserCredentials.refresh_token
    }
  }

  rp.post(options)
    .then((result) => {
      const newConfig = JSON.parse(result);
      const query =
        r.table('users')
          .get(userId)
          .update({
            xendoCredentials: newConfig
          });

      res.locals.xendoUserCredentials = newConfig;

      return db.rethinkQuery(query);
    })
    .then(() => {
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

    res.locals.xendoUserCredentials = xendoResult;

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
    client_id: xendoConfig.clientId,
    email: xendoEmail,
    service_name: serviceToAppend.service_name,
    access_token: serviceToAppend.authData.access_token,
    refresh_token: serviceToAppend.authData.refresh_token,
    display_name: serviceToAppend.show_name,
    account_name: serviceToAppend.id
  });
  const url = xendoConfig.addServiceToUserEndpoint + '?' + qs;
  let xendoResult;

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

    xendoResult = result;

    const checkXendoUserServiceQ =
      r.table('xendo_user_services')
        .getAll(xendoResult.service_id, {index: 'service_id'});

    return db.rethinkQuery(checkXendoUserServiceQ);
  })
  .then((xendoService) => {
    if (xendoService.length > 0) {
      return next();
    }

    const newXendoService = Object.assign({}, xendoResult, {
      service_account_id: serviceToAppend.id,
      user_id: userId
    });

    const insertXendoUserServiceQ =
      r.table('xendo_user_services')
        .insert(newXendoService);

    return db.rethinkQuery(insertXendoUserServiceQ);
  })
  .then(() => {
    return next();
  })
  .catch((error) => {
    return next(error);
  })
}

const xendoRemoveServiceFromUser = (req, res, next) => {
  const {
    xendoSwipesCredentials,
    xendoUserServiceId
  } = res.locals;
  const url = xendoConfig.userServiceEndpoint + xendoUserServiceId;

  request.delete(url, {
    auth: {
      bearer: xendoSwipesCredentials.access_token
    }
  }, (error, response) => {
    if (error) {
      return next(error);
    }

    return next();
  })
}

const xendoSearch = (req, res, next) => {
  const q = req.body.q;
  const sources = req.body.sources.join(',');
  const {
    xendoUserCredentials
  } = res.locals;
  const qs = querystring.stringify({
    q,
    sources
  });
  const url = xendoConfig.searchEndpoint + '?' + qs;

  rp.get(url, {
    auth: {
      bearer: xendoUserCredentials.access_token
    }
  })
  .then((result) => {
    res.locals.result = JSON.parse(result);

    return next();
  })
  .catch((error) => {
    return next(error);
  })
}

export {
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserCredentials,
  xendoRefreshUserToken,
  xendoUserSignUp,
  xendoAddServiceToUser,
  xendoRemoveServiceFromUser,
  xendoSearch
}
