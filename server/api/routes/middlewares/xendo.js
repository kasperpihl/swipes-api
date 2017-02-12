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
} from '../../utils';
import db from '../../../db';
import * as services from '../../services';

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
const xendoUserCredentials = valLocals('xendoUserCredentials', {
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;
  const query = r.table('users').get(user_id);

  db.rethinkQuery(query)
    .then((result) => {
      if (!result) {
        return next('Invalid user_id :/');
      }

      setLocals({
        xendoUserCredentials: result.xendoCredentials,
      });

      return next();
    })
    .catch((error) => {
      return next(error);
    });
});
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
  serviceToAppend: object.require(),
}, (req, res, next) => {
  const {
    user_id,
    xendoSwipesCredentials,
    serviceToAppend,
  } = res.locals;
  const xendoEmail = `${user_id}@swipesapp.com`;
  const qs = querystring.stringify({
    client_id: xendoConfig.clientId,
    email: xendoEmail,
    service_name: serviceToAppend.service_name_xendo,
    access_token: serviceToAppend.auth_data.access_token,
    refresh_token: serviceToAppend.auth_data.refresh_token,
    display_name: serviceToAppend.show_name,
    account_name: serviceToAppend.id,
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
      service_account_id: serviceToAppend.id,
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
  xendoUserServiceId: number.require(),
}, (req, res, next) => {
  const {
    xendoSwipesCredentials,
    xendoUserServiceId,
  } = res.locals;

  if (xendoUserServiceId === null) {
    return next();
  }

  const url = xendoConfig.userServiceEndpoint + xendoUserServiceId;

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
const xendoSearch = valLocals('xendoSearch', {
  xendoUserCredentials: object.require(),
}, (req, res, next, setLocals) => {
  const q = res.locals.q;
  const page_size = parseInt(res.locals.page_size, 10);
  const p = parseInt(res.locals.p, 10) || 0;
  const sources = (res.locals.sources || []).join(',');
  const {
    xendoUserCredentials,
  } = res.locals;
  const qo = {
    q,
    p,
  };

  if (sources.length > 0) {
    qo.sources = sources;
  }

  if (page_size > 0) {
    qo.page_size = page_size;
  }

  const qs = querystring.stringify(qo);

  const url = `${xendoConfig.searchEndpoint}?${qs}`;

  rp.get(url, {
    auth: {
      bearer: xendoUserCredentials.access_token,
    },
  })
  .then((result) => {
    setLocals({
      result: JSON.parse(result),
    });

    return next();
  })
  .catch((error) => {
    return next(error);
  });
});
const mapSourceToServiceName = (source) => {
  if (source === 'googledocs') {
    return 'drive';
  }

  return source;
};
const xendoSearchMapResults = valLocals('xendoSearchMapResults', {
  user_id: string.require(),
  result: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    result,
  } = res.locals;
  const xendoServicesQ =
    r.table('xendo_user_services')
      .getAll(user_id, { index: 'user_id' })
      .map((service) => {
        return [
          service('service_id').coerceTo('string'),
          service('service_account_id').coerceTo('string'),
        ];
      })
      .coerceTo('object');

  db.rethinkQuery(xendoServicesQ)
    .then((userServices) => {
      const mappedResults = result.response.docs.filter((doc) => {
        return userServices[doc.service_id] !== undefined;
      }).map((doc) => {
        const service = services[mapSourceToServiceName(doc.source)];
        let mappedDoc = {};

        if (service.mapSearch) {
          mappedDoc = service.mapSearch(doc);
        }

        const account_id = userServices[doc.service_id];

        return Object.assign({}, mappedDoc, {
          permission: {
            account_id,
          },
        });
      });

      setLocals({
        mappedResults,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserCredentials,
  xendoUserSignUp,
  xendoAddServiceToUser,
  xendoRemoveServiceFromUser,
  xendoSearch,
  xendoSearchMapResults,
};
