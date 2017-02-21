import config from 'config';
import rp from 'request-promise';
import request from 'request';
import querystring from 'querystring';
import r from 'rethinkdb';
import {
  string,
  number,
  object,
} from 'valjs';
import {
  valLocals,
} from '../utils';
import db from '../db';

const xendoConfig = config.get('xendo');
const xendoRefreshSwipesToken = valLocals('xendoRefreshSwipesToken', {
  xendoSwipesCredentials: object.require(),
}, (req, res, next, setLocals) => {
  // TODO check the expire time and don't refresh the token everytime
  const {
    xendoSwipesCredentials,
  } = res.locals;
  const options = {
    method: 'POST',
    uri: xendoConfig.accessTokenEndpoint,
    form: {
      grant_type: 'refresh_token',
      client_id: xendoConfig.clientId,
      client_secret: xendoConfig.clientSecret,
      refresh_token: xendoSwipesCredentials.refresh_token,
    },
  };

  rp.post(options)
    .then((result) => {
      const newConfig = JSON.parse(result);
      const query =
        r.table('config')
          .getAll('xendo', { index: 'key' })
          .nth(0)
          .update(newConfig);

      setLocals({
        xendoSwipesCredentials: newConfig,
      });

      return db.rethinkQuery(query);
    })
    .then(() => {
      return next();
    })
    .catch((error) => {
      return next(error);
    });
});
const xendoSwipesCredentials = (req, res, next) => {
  const query = r.table('config').getAll('xendo', { index: 'key' }).nth(0);

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
    });
};
const xendoUserSignUp = valLocals('xendoUserSignUp', {
  user_id: string.require(),
  xendoSwipesCredentials: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    xendoSwipesCredentials,
  } = res.locals;
  const xendoEmail = `${user_id}@swipesapp.com`;
  const qs = querystring.stringify({
    email: xendoEmail,
    username: xendoEmail,
    client_id: xendoConfig.clientId,
    client_secret: xendoConfig.clientSecret,
  });
  const url = `${xendoConfig.addUserEndpoint}?${qs}`;

  rp.get(url, {
    auth: {
      bearer: xendoSwipesCredentials.access_token,
    },
  })
  .then((xendoResult) => {
    if (xendoResult.error) {
      return next(xendoResult.error);
    }

    setLocals({
      xendoUserCredentials: xendoResult,
    });

    const updateSwipesUserQ = r.table('users').get(user_id).update({
      xendoCredentials: JSON.parse(xendoResult),
    });

    return db.rethinkQuery(updateSwipesUserQ);
  })
  .then(() => {
    return next();
  })
  .catch((error) => {
    return next(error);
  });
});
const xendoAddServiceToUser = valLocals('xendoAddServiceToUser', {
  user_id: string.require(),
  xendoSwipesCredentials: object.require(),
  service_to_append: object.require(),
}, (req, res, next) => {
  const {
    user_id,
    xendoSwipesCredentials,
    service_to_append,
  } = res.locals;
  const xendoEmail = `${user_id}@swipesapp.com`;
  const qs = querystring.stringify({
    client_id: xendoConfig.clientId,
    email: xendoEmail,
    service_name: service_to_append.service_name_xendo,
    access_token: service_to_append.auth_data.access_token,
    refresh_token: service_to_append.auth_data.refresh_token,
    display_name: service_to_append.show_name,
    account_name: service_to_append.id,
  });
  const url = `${xendoConfig.addServiceToUserEndpoint}?${qs}`;
  let xendoResult;

  rp.get(url, {
    auth: {
      bearer: xendoSwipesCredentials.access_token,
    },
  })
  .then((result) => {
    xendoResult = JSON.parse(result);

    if (xendoResult.error) {
      return next(xendoResult.error);
    }

    const checkXendoUserServiceQ =
      r.table('xendo_user_services')
        .getAll(xendoResult.service_id, { index: 'service_id' });

    return db.rethinkQuery(checkXendoUserServiceQ);
  })
  .then((xendoService) => {
    if (xendoService.length > 0) {
      return next();
    }

    const newXendoService = Object.assign({}, xendoResult, {
      user_id,
      service_account_id: service_to_append.id,
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
  });
});
const xendoRemoveServiceFromUser = valLocals('xendoRemoveServiceFromUser', {
  xendoSwipesCredentials: object.require(),
  xendo_user_service_id: number.require(),
}, (req, res, next) => {
  const {
    xendoSwipesCredentials,
    xendo_user_service_id,
  } = res.locals;

  if (xendo_user_service_id === null) {
    return next();
  }

  const url = xendoConfig.userServiceEndpoint + xendo_user_service_id;

  return request.delete(url, {
    auth: {
      bearer: xendoSwipesCredentials.access_token,
    },
  }, (error) => {
    if (error) {
      return next(error);
    }

    return next();
  });
});

export {
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserSignUp,
  xendoAddServiceToUser,
  xendoRemoveServiceFromUser,
};
