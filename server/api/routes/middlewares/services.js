import {
  string,
  object,
} from 'valjs';
import * as services from '../../services';
import {
  getServiceByName,
} from './db_utils/services';
import {
  dbUsersAddSevice,
  dbUsersGetServiceWithAuth,
} from './db_utils/users';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';
import {
  valLocals,
} from '../../utils';
import {
  service,
  linkPermission,
} from '../../validators';

const serviceIdGet = valLocals('serviceIdGet', {
  service_name: string.require(),
}, (req, res, next, setLocals) => {
  const {
    service_name,
  } = res.locals;

  getServiceByName(service_name)
    .then((service) => {
      if (!service) {
        return next(new SwipesError('Service not found'));
      }

      setLocals({
        service_id: service.id,
        service_name_xendo: service.xendo_name,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const serviceWithAuthGet = valLocals('serviceWithAuthGet', {
  user_id: string.require(),
  service_name: string.require(),
  account_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    service_name,
    account_id,
  } = res.locals;

  return dbUsersGetServiceWithAuth({ user_id, service_name, account_id })
    .then((results) => {
      if (results && !(results.length > 0)) {
        return next(new SwipesError('Service not found'));
      }

      const service = results[0];

      setLocals({
        service_auth_data: service.auth_data,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const serviceWithAuthFromLinkGet = valLocals('serviceWithAuthFromLinkGet', {
  link_with_permission: object.as({
    user_id: string.require(),
    service,
    permission: linkPermission,
  }).require(),
}, (req, res, next, setLocals) => {
  const {
    link_with_permission,
  } = res.locals;
  const user_id = link_with_permission.user_id;
  const service_name = link_with_permission.service.name;
  const account_id = link_with_permission.permission.account_id;

  return dbUsersGetServiceWithAuth({ user_id, service_name, account_id })
    .then((results) => {
      if (results && !(results.length > 0)) {
        return next(new SwipesError('Service not found'));
      }

      const service = results[0];

      setLocals({
        service_name,
        service_auth_data: service.auth_data,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const serviceImport = valLocals('serviceImport', {
  service_name: string.require(),
}, (req, res, next, setLocals) => {
  const {
    service_name,
  } = res.locals;

  if (services[service_name]) {
    setLocals({
      service: services[service_name],
    });

    return next();
  }

  return next(new SwipesError('Service not found'));
});
const serviceGetAuthUrl = valLocals('serviceGetAuthUrl', {
  service: object.require(),
}, (req, res, next, setLocals) => {
  const {
    service,
  } = res.locals;

  service.authUrl({}, (error, result) => {
    if (error) {
      return next(new SwipesError('Something went wrong with the authorization'));
    }

    setLocals({
      authUrl: result.url,
    });

    return next();
  });
});
const serviceDoRequest = valLocals('serviceDoRequest', {
  user_id: string.require(),
  service_auth_data: object.require(),
  service: object.require(),
  method: string.require(),
  parameters: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    service_auth_data,
    service,
    method,
    parameters,
  } = res.locals;

  const options = {
    auth_data: service_auth_data,
    method,
    params: parameters,
    user: { user_id },
  };

  service.request(options, (err, result) => {
    if (err) {
      return next(new SwipesError('Something went wrong with the request'));
    }

    setLocals({
      result,
    });

    return next();
  });
});
const serviceDoStream = valLocals('serviceDoStream', {
  user_id: string.require(),
  service_auth_data: object.require(),
  service: object.require(),
  urlData: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    service_auth_data,
    service,
    urlData,
  } = res.locals;

  const options = {
    auth_data: service_auth_data,
    urlData,
    user: { user_id },
  };

  service.requestStream(options, res, next);
});
const serviceDoBrowse = valLocals('serviceDoBrowse', {
  user_id: string.require(),
  service_auth_data: object.require(),
  service: object.require(),
  account_id: string.require(),
  query: object,
  page: object,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    service_auth_data,
    service,
    account_id,
    query = null,
    page = null,
  } = res.locals;

  const options = {
    auth_data: service_auth_data,
    query,
    page,
    account_id,
    user: { user_id },
  };

  return service.browse(options, (err, result) => {
    if (err) {
      console.log(err);
      return next(new SwipesError('serviceBrowse - Something went wrong with the browse request', err));
    }

    setLocals({
      result,
    });

    return next();
  });
});
const servicePreview = valLocals('servicePreview', {
  service_auth_data: object.require(),
  service: object.require(),
  link_with_permission: object.as({
    user_id: string.require(),
    service,
  }).require(),
}, (req, res, next, setLocals) => {
  const {
    service_auth_data,
    service,
    link_with_permission,
  } = res.locals;

  const options = {
    auth_data: service_auth_data,
    type: link_with_permission.service.type,
    itemId: link_with_permission.service.id,
    user: { user_id: link_with_permission.user_id },
  };

  return service.preview(options, (err, result) => {
    if (err) {
      return next(new SwipesError('servicePreview - Something went wrong with the preview request', err));
    }

    setLocals({
      preview: result,
    });

    return next();
  });
});
const servicePreviewFind = valLocals('servicePreviewFind', {
  user_id: string.require(),
  service_auth_data: object.require(),
  service_item_id: string.require(),
  service_type: string.require(),
  service: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    service_auth_data,
    service_item_id,
    service_type,
    service,
  } = res.locals;

  const options = {
    type: service_type,
    auth_data: service_auth_data,
    itemId: service_item_id,
    user: { user_id },
  };

  return service.preview(options, (err, result) => {
    if (err) {
      return next(new SwipesError('servicePreviewFind - Something went wrong with the preview request', err));
    }

    setLocals({
      preview: result,
    });

    return next();
  });
});
const serviceGetAuthData = valLocals('serviceGetAuthData', {
  user_id: string.require(),
  service_name: string.require(),
  service_name_xendo: string.require(),
  service_id: string.require(),
  query: object.require(),
  service: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    service_name,
    service_name_xendo,
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
    if (!serviceData.id) {
      return next(new SwipesError('service id is required! - serviceGetAuthData'));
    }

    serviceData.id = serviceData.id.toString();

    const serviceToAppend = Object.assign({}, serviceData, {
      service_id,
      service_name,
      service_name_xendo,
    });

    setLocals({
      serviceToAppend,
    });

    return next();
  });
});
const serviceUpdateAuthData = valLocals('serviceUpdateAuthData', {
  user_id: string.require(),
  serviceToAppend: object.require(),
}, (req, res, next) => {
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
});
const serviceAuthCheck = valLocals('serviceAuthCheck', {
  credentials: object.require(),
}, (req, res, next, setLocals) => {
  const {
    credentials,
    service,
  } = res.locals;

  if (!service.authCheck) {
    return next(new SwipesError('This service does not support checking the auth'));
  }

  return service.authCheck(credentials, (error, result) => {
    if (error) {
      return next(new SwipesError('Something went wrong with checking the auth'));
    }

    setLocals({
      result,
    });

    return next();
  });
});

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
  serviceDoStream,
  serviceDoBrowse,
  serviceAuthCheck,
};
