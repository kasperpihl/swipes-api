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

  if (service_name === 'swipes') {
    return next();
  }

  return dbUsersGetServiceWithAuth({ user_id, service_name, account_id })
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
const serviceWithAuthFromLinkGet = (req, res, next) => {
  const {
    link_with_permission,
  } = res.locals;
  const user_id = link_with_permission.user_id;
  const service_name = link_with_permission.meta.service;
  const account_id = link_with_permission.permission.account_id;

  if (service_name === 'swipes') {
    return next();
  }

  return dbUsersGetServiceWithAuth({ user_id, service_name, account_id })
    .then((results) => {
      if (results && !(results.length > 0)) {
        return next(new SwipesError('Service not found'));
      }

      const service = results[0];
      console.log(service.auth_data);
      res.locals.service_auth_data = service.auth_data;
      res.locals.service_name = service_name;

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

  if (service_name === 'swipes') {
    return next();
  }

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
const servicePreview = (req, res, next) => {
  const {
    service_auth_data,
    service_name,
    service,
    link_with_permission,
    // meta,
  } = res.locals;

  if (service_name === 'swipes') {
    // Kasper not sure what's up here
    // res.locals.short_url_data = Object.assign({}, link, meta);
    return next();
  }

  const options = {
    auth_data: service_auth_data,
    type: link_with_permission.type,
    itemId: link_with_permission.id,
    user: { user_id: link_with_permission.user_id },
  };

  return service.preview(options, (err, result) => {
    if (err) {
      return next(new SwipesError('Something went wrong with the preview request'));
    }

    res.locals.returnObj.preview = result;

    return next();
  });
};
const servicePreviewFind = (req, res, next) => {
  const {
    user_id,
    service_auth_data,
    service_name,
    service,
    id,
    type,
  } = res.locals;

  if (service_name === 'swipes') {
    // Kasper not sure what's up here
    // res.locals.short_url_data = Object.assign({}, link, meta);
    return next();
  }

  const options = {
    type,
    auth_data: service_auth_data,
    itemId: id,
    user: { user_id },
  };

  return service.preview(options, (err, result) => {
    if (err) {
      return next(new SwipesError('Something went wrong with the preview request'));
    }

    res.locals.returnObj.preview = result;

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
  serviceWithAuthFromLinkGet,
  serviceDoRequest,
  servicePreview,
  servicePreviewFind,
  serviceGetAuthData,
  serviceUpdateAuthData,
};
