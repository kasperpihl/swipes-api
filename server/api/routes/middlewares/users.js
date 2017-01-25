import config from 'config';
import r from 'rethinkdb';
import jwt from 'jwt-simple';
import sha1 from 'sha1';
import moment from 'moment';
import {
  string,
  number,
  object,
} from 'valjs';
import {
  valLocals,
  generateSlackLikeId,
} from '../../utils';
import * as services from '../../services';
import db from '../../../db';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';
import {
  dbUsersGetService,
  dbUsersRemoveService,
  dbUsersUpdateProfilePic,
  dbUsersGetSingleWithOrganizations,
} from './db_utils/users';
import {
  dbXendoGetService,
  dbXendoRemoveService,
} from './db_utils/xendo';

const userAvailability = (req, res, next) => {
  const {
    email,
    name,
  } = res.locals;

  const query = r.do(
    r.table('users').getAll(email, { index: 'email' }).isEmpty(),
    r.table('users').getAll(name, { index: 'name' }).isEmpty(),
    (isEmail, isName) => {
      return r.expr([isEmail, isName]);
    },
  );

  db.rethinkQuery(query)
    .then((results) => {
      if (!results[0]) {
        return next(new SwipesError('There is a user with that email'));
      } else if (!results[1]) {
        return next(new SwipesError('This username is not available'));
      }

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const userAddToOrganization = (req, res, next) => {
  const {
    organization,
  } = res.locals;

  const organizationId = generateSlackLikeId('O');
  const user_id = generateSlackLikeId('U');
  const name = organization;
  const nameToCompare = name.toLowerCase().replace(/\s+/g, '_');
  const insertDoc = {
    id: organizationId,
    name,
    name_to_compare: nameToCompare,
    users: [user_id],
  };
  const checkQ = r.table('organizations').getAll(nameToCompare, { index: 'name_to_compare' });
  const insertQ = r.table('organizations').insert(insertDoc);

  db.rethinkQuery(checkQ)
    .then((organizations) => {
      if (organizations.length > 0) {
        const organization = organizations[0];
        const updateQ = r.table('organizations').update({
          users: r.row('users').append(user_id),
        });

        res.locals.organizationId = organization.id;

        return db.rethinkQuery(updateQ);
      }

      res.locals.organizationId = organizationId;

      return db.rethinkQuery(insertQ);
    })
    .then(() => {
      res.locals.user_id = user_id;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};
const userSignUp = (req, res, next) => {
  const {
    user_id,
    email,
    name,
    password,
    organizationId,
  } = res.locals;
  const userDoc = {
    id: user_id,
    apps: [],
    services: [],
    organizations: [organizationId],
    email,
    name,
    password: sha1(password),
    created: moment().unix(),
  };
  const createUserQ = r.table('users').insert(userDoc);
  const token = jwt.encode({
    iss: user_id,
  }, config.get('jwtTokenSecret'));

  return db.rethinkQuery(createUserQ)
    .then(() => {
      res.locals.token = token;
      res.locals.returnObj = {
        user_id,
        token,
      };

      return next();
    }).catch((err) => {
      return next(err);
    });
};
const userSignIn = valLocals('userSignIn', {
  email: string.format('email').require(),
  password: string.min(1).require(),
}, (req, res, next) => {
  const {
    email,
    password,
  } = res.locals;
  const query = r.table('users').filter({
    email,
  }).map((user) => {
    return {
      id: user('id'),
      password: user('password'),
      is_admin: user('is_admin').default(false),
    };
  });

  return db.rethinkQuery(query)
    .then((users) => {
      const user = users[0];
      const sha1Password = sha1(password);

      if (users.length === 0) {
        return next(new SwipesError('Wrong email or password'));
      } else if (sha1Password !== user.password) {
        return next(new SwipesError('Wrong email or password'));
      }

      const token = jwt.encode({
        iss: user.id,
        adm: user.is_admin,
        sysAdm: user.is_sysadmin,
      }, config.get('jwtTokenSecret'));

      res.locals.token = token;
      res.locals.returnObj.token = token;

      return next();
    }).catch((err) => {
      return next(err);
    });
});
const usersGetService = valLocals('usersGetService', {
  user_id: string.require(),
  account_id: string.require(),
}, (req, res, next) => {
  const {
    user_id,
    account_id,
  } = res.locals;

  return dbUsersGetService(user_id, account_id)
    .then((service) => {
      if (service === null) {
        return next(new SwipesError('There is no such service'));
      }

      res.locals.service = service;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersCleanupRegisteredWebhooksToService = valLocals('usersCleanupRegisteredWebhooksToService', {
  user_id: string.require(),
  service: object.require(),
}, (req, res, next) => {
  const {
    user_id,
    service,
  } = res.locals;
  const serviceName = service.service_name;

  if (serviceName === 'asana') {
    return services[serviceName]
      .unsubscribeFromAllWebhooks({ auth_data: service.auth_data, user_id })
      .then(() => {
        return next();
      })
      .catch((err) => {
        return next(err);
      });
  }

  return next();
});
const usersGetXendoServiceId = valLocals('usersGetXendoServiceId', {
  user_id: string.require(),
  service: object.require(),
}, (req, res, next) => {
  const {
    user_id,
    service,
  } = res.locals;

  return dbXendoGetService(user_id, service.id)
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
    });
});
const usersRemoveXendoService = valLocals('usersRemoveXendoService', {
  xendoUserServiceId: number.require(),
}, (req, res, next) => {
  const {
    xendoUserServiceId,
  } = res.locals;

  if (xendoUserServiceId === null) {
    return next();
  }

  return dbXendoRemoveService(xendoUserServiceId)
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersRemoveService = valLocals('usersRemoveService', {
  user_id: string.require(),
  service: object.require(),
}, (req, res, next) => {
  const {
    user_id,
    service,
  } = res.locals;

  return dbUsersRemoveService(user_id, service.id)
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersUpdateProfilePic = valLocals('usersUpdateProfilePic', {
  user_id: string.require(),
}, (req, res, next) => {
  const {
    user_id,
  } = res.locals;
  const profilePic = req.body.profile_pic;

  return dbUsersUpdateProfilePic({ user_id, profilePic })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersGetSingleWithOrganizations = valLocals('usersGetSingleWithOrganizations', {
  user_id: string.require(),
}, (req, res, next) => {
  const {
    user_id,
  } = res.locals;

  return dbUsersGetSingleWithOrganizations({ user_id })
    .then((user) => {
      res.locals.user = user;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

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
  usersGetSingleWithOrganizations,
};
