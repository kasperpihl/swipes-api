"use strict";

import config from 'config';
import r from 'rethinkdb';
import jwt from 'jwt-simple';
import sha1 from 'sha1';
import moment from 'moment';
import * as services from '../../services';
import db from '../../../db';
import {
  SwipesError
} from '../../../middlewares/swipes-error';
import {
  generateSlackLikeId
} from '../../utils.js';
import {
  dbUsersGetService,
  dbUsersRemoveService,
  dbUsersUpdateProfilePic,
  dbUsersGetSingleWithOrganizations
} from './db_utils/users';
import {
  dbXendoGetService,
  dbXendoRemoveService
} from './db_utils/xendo';

const userAvailability = (req, res, next) => {
  const {
    email,
    name
  } = res.locals;

  const query = r.do(
    r.table('users').getAll(email, {index: 'email'}).isEmpty(),
    r.table('users').getAll(name, {index: 'name'}).isEmpty(),
    (isEmail, isName) => {
      return r.expr([isEmail, isName])
    }
  )

  db.rethinkQuery(query)
    .then((results) => {
      if (!results[0]) {
        return next(new SwipesError('There is a user with that email'));
      } else if (!results[1]) {
        return next(new SwipesError('This username is not available'));
      } else {
        return next();
      }
    })
    .catch((err) => {
      return next(err);
    })
}

const userAddToOrganization = (req, res, next) => {
  const {
    organization
  } = res.locals;

  const organizationId = generateSlackLikeId('O');
  const userId = generateSlackLikeId('U');
  const name = organization;
  const nameToCompare = name.toLowerCase().replace(/\s+/g,"_");
  const insertDoc = {
    id: organizationId,
    name,
    name_to_compare: nameToCompare,
    users: [userId]
  }
  const checkQ = r.table('organizations').getAll(nameToCompare, {index: 'name_to_compare'});
  const insertQ = r.table('organizations').insert(insertDoc);

  db.rethinkQuery(checkQ)
    .then((organizations) => {
      if (organizations.length > 0) {
        const organization = organizations[0];
        const updateQ = r.table('organizations').update({
          users: r.row('users').append(userId)
        });

        res.locals.organizationId = organization.id;

        return db.rethinkQuery(updateQ);
      }

      res.locals.organizationId = organizationId;

      return db.rethinkQuery(insertQ);
    })
    .then(() => {
      res.locals.userId = userId;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const userSignUp = (req, res, next) => {
  const {
    email,
    name,
    password,
    organizationId,
    userId
  } = res.locals;
  const userDoc = {
    id: userId,
    apps: [],
    services:[],
    organizations: [organizationId],
    email: email,
    name: name,
    password: sha1(password),
    created: moment().unix()
  }
  const createUserQ = r.table('users').insert(userDoc);
  const token = jwt.encode({
    iss: userId
  }, config.get('jwtTokenSecret'))

  db.rethinkQuery(createUserQ)
    .then(() => {
      res.locals.userId = userId;
      res.locals.token = token;

      return next();
    }).catch((err) => {
      return next(err);
    });
}

const userSignIn = (req, res, next) => {
  const {
    email,
    password
  } = res.locals;
  const query = r.table('users').filter({
    email: email
  }).map((user) => {
    return {
      id: user('id'),
      password: user('password'),
      is_admin: user("is_admin").default(false)
    }
  });

  db.rethinkQuery(query)
    .then((users) => {
      const user = users[0];
      const sha1Password = sha1(password);

      if (users.length === 0) {
        return next(new SwipesError('Wrong email or password'));
      } else if (sha1Password !== user.password) {
        return next(new SwipesError('Wrong email or password'));
      } else {
        const token = jwt.encode({
          iss: user.id,
          adm: user.is_admin,
          sysAdm: user.is_sysadmin
        }, config.get('jwtTokenSecret'))

        res.locals.token = token;

        return next();
      }
    }).catch((err) => {
      return next(err);
    });
}

const usersGetService = (req, res, next) => {
  const userId = req.userId;
  const {
    account_id
  } = res.locals;

  dbUsersGetService(userId, account_id)
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

const usersCleanupRegisteredWebhooksToService = (req, res, next) => {
  const userId = req.userId;
  const {
    service
  } = res.locals;
  const serviceName = service.service_name;

  if (serviceName === 'asana') {
    console.log(services[serviceName]);
    services[serviceName].unsubscribeFromAllWebhooks({ auth_data: service.auth_data, userId })
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
  const userId = req.userId;
  const {
    service
  } = res.locals;

  dbXendoGetService(userId, service.id)
    .then((xendoUserService) => {
      let xendoUserServiceId = null;

      if (xendoUserService && xendoUserService.length > 0) {
        xendoUserServiceId = xendoUserService[0].service_id;
      }

      res.locals.xendoUserServiceId = xendoUserServiceId;

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

  if (xendoUserServiceId === null) {
    return next();
  }

  dbXendoRemoveService(xendoUserServiceId)
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const usersRemoveService = (req, res, next) => {
  const userId = req.userId;
  const {
    service
  } = res.locals;

  dbUsersRemoveService(userId, service.id)
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const usersUpdateProfilePic = (req, res, next) => {
  const userId = req.userId;
  const profilePic = req.body.profile_pic;

  dbUsersUpdateProfilePic({ userId, profilePic })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const usersGetSingleWithOrganizations = (req, res, next) => {
  const userId = req.userId;

  dbUsersGetSingleWithOrganizations({ userId })
    .then((user) => {
      res.locals.user = user;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

export {
  userAvailability,
  userAddToOrganization,
  userSignUp,
  userSignIn,
  usersGetService,
  usersCleanupRegisteredWebhooksToService,
  usersGetXendoServiceId,
  usersRemoveXendoService,
  usersRemoveService,
  usersUpdateProfilePic,
  usersGetSingleWithOrganizations
}
