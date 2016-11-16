"use strict";

import * as services from '../../services';
import {
  getServiceByManifestId,
  getServiceWithAuth,
  appendSeviceToUser
} from './db_utils/services';
import {
  SwipesError
} from '../../../middlewares/swipes-error';

const serviceIdGet = (req, res, next) => {
	const manifestId = res.locals.manifest_id;

	getServiceByManifestId(manifestId)
		.then((service) => {
			if (!service) {
				return next(new SwipesError('Service not found'));
			}

			res.locals.service_id = service.id;

			return next();
		})
		.catch((err) => {
			return next(err);
		})
}

const serviceWithAuthGet = (req, res, next) => {
  const user_id = req.userId;
  const {
    manifest_id,
    account_id
  } = res.locals;

  getServiceWithAuth({ user_id, manifest_id, account_id })
    .then((results) => {
      if (results && !(results.length > 0)) {
        return next(new SwipesError('Service not found'));
      }

      const service = results[0];
      res.locals.service_auth_data = service.authData;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const serviceImport = (req, res, next) => {
  const {
    manifest_id
  } = res.locals;

  if (services[manifest_id]) {
    res.locals.service = services[manifest_id];

    return next();
  } else {
    return next(new SwipesError('Service not found'));
  }
}

const serviceGetAuthUrl = (req, res, next) => {
  const {
    service
  } = res.locals;

  service.authUrl({}, (error, result) => {
  	if (error) {
      return next(new SwipesError('Something went wrong with the authorization'));
  	}

    res.locals.authUrl = result.url;

    return next();
  });
}

const serviceDoRequest = (req, res, next) => {
  const user_id = req.userId;
  const {
    service_auth_data,
    service,
    data
  } = res.locals;

  const options = {
    authData: service_auth_data,
    method: data.method,
    params: data.parameters,
    user: {userId: user_id}
  };

  service.request(options, function (err, result) {
    if (err) {
      return next(new SwipesError('Something went wrong with the request'));
    }

    res.locals.service_request_result = result;

    return next();
  });
}

const serviceDoShareRequest = (req, res, next) => {
  const user_id = req.userId;
  const {
    service_auth_data,
    service,
    link,
    account_id,
    meta
  } = res.locals;

  const options = {
    authData: service_auth_data,
    type: link.type,
    itemId: link.id,
    user: { userId: user_id }
  };

  service.shareRequest(options, function (err, result) {
    if (err) {
      return next(new SwipesError('Something went wrong with the share request'));
    }

    res.locals.service_share_request_result = result;
    res.locals.short_url_data = Object.assign({}, link, {
      meta: result.meta
    });

    return next();
  });
}

const serviceGetAuthData = (req, res, next) => {
  const userId = req.userId;
  const {
    manifest_id,
    service_id,
    query,
    service
  } = res.locals;

  // The userId is needed for some services
  const data = Object.assign({}, { query, userId });

  service.authData(data, (error, result) => {
    if (error) {
      return next(new SwipesError('Something went wrong with retrieving auth data'));
    }

    let serviceData = result;

    // To allow multiple accounts, each account should provide unique id so we don't get double auth from an account
    if (!serviceData.id) {
      // If no id is provided (or no handler was set), use the service id. Multiple accounts won't work then.
      serviceData.id = service.id;
    }

    const serviceToAppend = Object.assign({}, serviceData, {
      service_id,
      service_name: manifest_id
    });

    res.locals.serviceToAppend = serviceToAppend;

    return next();
  })
}

const serviceUpdateAuthData = (req, res, next) => {
  const userId = req.userId;
  const {
    serviceToAppend
  } = res.locals;

  // T_TODO: if(service_id  === authData.service_id && id === authData.id)
	// Remove it before inserting the new one (or replace etc.)
	// This will both allow multi accounts and prevents duplicate accounts
  appendSeviceToUser({ user_id: userId, serviceToAppend })
    .then(() => {
      return next();
    })
    .catch((error) => {
      return next(error)
    })
}

export {
  serviceIdGet,
  serviceImport,
  serviceGetAuthUrl,
  serviceWithAuthGet,
  serviceDoRequest,
  serviceDoShareRequest,
  serviceGetAuthData,
  serviceUpdateAuthData
}
