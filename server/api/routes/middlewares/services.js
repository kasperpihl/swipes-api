import * as services from '../../services';
import {
  getServiceByManifestId,
} from './db_utils/services';
import {
  dbUsersAddSevice,
  dbUsersGetServiceWithAuth,
} from './db_utils/users';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const serviceIdGet = (req, res, next) => {
  const serviceName = res.locals.service_name;

  getServiceByManifestId(serviceName)
    .then((service) => {
      if (!service) {
        return next(new SwipesError('Service not found'));
      }

      res.locals.service_id = service.id;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const serviceWithAuthGet = (req, res, next) => {
  const {
    user_id,
    service_name,
    account_id,
  } = res.locals;

  dbUsersGetServiceWithAuth({ user_id, service_name, account_id })
    .then((results) => {
      if (results && !(results.length > 0)) {
        return next(new SwipesError('Service not found'));
      }

      const service = results[0];
      res.locals.service_auth_data = service.auth_data;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const serviceImport = (req, res, next) => {
  const {
    service_name,
  } = res.locals;

  if (services[service_name]) {
    res.locals.service = services[service_name];

    return next();
  }

  return next(new SwipesError('Service not found'));
};
const serviceGetAuthUrl = (req, res, next) => {
  const {
    service,
  } = res.locals;

  service.authUrl({}, (error, result) => {
    if (error) {
      return next(new SwipesError('Something went wrong with the authorization'));
    }

    res.locals.authUrl = result.url;

    return next();
  });
};
const serviceDoRequest = (req, res, next) => {
  const {
    user_id,
    service_auth_data,
    service,
    data,
  } = res.locals;

  const options = {
    auth_data: service_auth_data,
    method: data.method,
    params: data.parameters,
    user: { user_id },
  };

  service.request(options, (err, result) => {
    if (err) {
      return next(new SwipesError('Something went wrong with the request'));
    }

    res.locals.service_request_result = result;

    return next();
  });
};
const serviceDoShareRequest = (req, res, next) => {
  const {
    user_id,
    service_auth_data,
    service,
    link,
  } = res.locals;

  const options = {
    auth_data: service_auth_data,
    type: link.type,
    itemId: link.id,
    user: { user_id },
  };

  service.shareRequest(options, (err, result) => {
    if (err) {
      return next(new SwipesError('Something went wrong with the share request'));
    }

    res.locals.service_share_request_result = result;
    res.locals.short_url_data = Object.assign({}, link, {
      meta: result.meta,
    });

    return next();
  });
};
const serviceGetAuthData = (req, res, next) => {
  const {
    user_id,
    service_name,
    service_id,
    query,
    service,
  } = res.locals;

  // The user_id is needed for some services
  const data = Object.assign({}, { query, user_id });

  service.authData(data, (error, result) => {
    if (error) {
      return next(new SwipesError('Something went wrong with retrieving auth data'));
    }

    const serviceData = result;

    // To allow multiple accounts, each account should provide unique id
    // so we don't get double auth from an account
    if (!serviceData.id) {
      // If no id is provided (or no handler was set), use the service id.
      // Multiple accounts won't work then.
      serviceData.id = service.id;
    }

    // The id field should be string. Some services like asana are returning
    // numbers and this is okay for the auth_data but not for the id field in the root
    // because it is hell to write db queries that maches different type for a field
    serviceData.id = serviceData.id.toString();

    const serviceToAppend = Object.assign({}, serviceData, {
      service_id,
      service_name,
    });

    res.locals.serviceToAppend = serviceToAppend;

    return next();
  });
};
const serviceUpdateAuthData = (req, res, next) => {
  const {
    user_id,
    serviceToAppend,
  } = res.locals;

  dbUsersAddSevice({ user_id, service: serviceToAppend })
    .then(() => {
      return next();
    })
    .catch((error) => {
      return next(error);
    });
};

export {
  serviceIdGet,
  serviceImport,
  serviceGetAuthUrl,
  serviceWithAuthGet,
  serviceDoRequest,
  serviceDoShareRequest,
  serviceGetAuthData,
  serviceUpdateAuthData,
};
