import config from 'config';
import validator from 'validator';
import r from 'rethinkdb';
import db from '../db.js';
import SwipesError from '../swipes-error.js';
import {
  unsubscribeFromAll
} from '../../services/asana/webhooks';
// import {
//   asana
// } from '../../services/asana/asana.js';
// T_TODO after refactoring this will be compatible
const asana = require('../../services/asana/asana');

const getUserService = (req, res, next) => {
  const userId = req.userId;
  const serviceAccountId = req.body.id;

  if (validator.isNull(serviceAccountId)) {
    return next(new SwipesError('id is required'));
  }

  const coerceToNumber = isNaN(serviceAccountId) ? serviceAccountId : r.expr(serviceAccountId).coerceTo('number');
  const getServiceQ =
    r.table('users')
      .get(userId)('services')
      .filter((service) => {
        return service('id').eq(coerceToNumber)
      })
      .nth(0)

  db.rethinkQuery(getServiceQ)
    .then((service) => {
      if (service === null) {
        return next(new SwipesError('There is no such service'));
      }

      res.locals.service = service;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const cleanupWebhooksFromUserService = (req, res, next) => {
  const userId = req.userId;
  const {
    service
  } = res.locals;
  const serviceName = service.service_name;

  if (serviceName === 'asana') {
    unsubscribeFromAll({ asana, authData: service.authData, userId })
      .then(() => {
        return next();
      })
      .catch((err) => {
        return next(err);
      })
  } else {
    return next();
  }
}

const usersGetXendoServiceId = (req, res, next) => {
  const {
    service
  } = res.locals;

  const getQ = r.table('xendo_user_services')
    .getAll(service.id, {index: 'service_account_id'})
    .nth(0);

  db.rethinkQuery(getQ)
    .then((xendoUserService) => {
      if (validator.isNull(xendoUserService)) {
        return next(new SwipesError('Xendo service not found'));
      }

      res.locals.xendoUserServiceId = xendoUserService.service_id;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const usersRemoveXendoService = (req, res, next) => {
  const {
    xendoUserServiceId
  } = res.locals;

  const deleteQ = r.table('xendo_user_services')
    .getAll(xendoUserServiceId, {index: 'service_id'})
    .delete();

  db.rethinkQuery(deleteQ)
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const userRemoveService = (req, res, next) => {
  const userId = req.userId;
  const {
    service
  } = res.locals;
  let serviceAccountId = service.id;

  if (service.service_name === 'asana') {
    serviceAccountId = r.expr(serviceAccountId).coerceTo('number');
  }

  const updateQ =
    r.table('users')
      .get(userId)
      .update({services: r.row('services')
        .filter((service) => {
          return service('id').ne(serviceAccountId)
        })
      })

  db.rethinkQuery(updateQ)
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

export {
  getUserService,
  cleanupWebhooksFromUserService,
  usersGetXendoServiceId,
  usersRemoveXendoService,
  userRemoveService
}
