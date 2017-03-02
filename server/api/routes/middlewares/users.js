import r from 'rethinkdb';
import sha1 from 'sha1';
import moment from 'moment';
import Promise from 'bluebird';
import {
  string,
  number,
  object,
} from 'valjs';
import {
  getClientIp,
  valLocals,
  generateSlackLikeId,
  createTokens,
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
  dbUsersGetByEmailForSignIn,
} from './db_utils/users';
import {
  dbTokensInsertSingle,
  dbTokensRevoke,
} from './db_utils/tokens';
import {
  dbXendoGetService,
  dbXendoRemoveService,
} from './db_utils/xendo';

const userAvailability = valLocals('userAvailability', {
  email: string.format('email').require(),
}, (req, res, next) => {
  const {
    email,
  } = res.locals;

  const query = r.table('users').getAll(email, { index: 'email' }).isEmpty();

  db.rethinkQuery(query)
    .then((result) => {
      if (!result) {
        return next(new SwipesError('There is a user with that email'));
      }

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const userAddToOrganization = valLocals('userAddToOrganization', {
  invitation_code: string.require(),
}, (req, res, next, setLocals) => {
  const {
    invitation_code,
  } = res.locals;
  const user_id = generateSlackLikeId('U');
  const checkQ = r.table('organizations').getAll(invitation_code, { index: 'invitation_code' });

  db.rethinkQuery(checkQ)
    .then((organizations) => {
      if (organizations.length > 0) {
        const organization = organizations[0];
        const organizationId = organization.id;
        const updateQ =
          r.table('organizations')
            .get(organizationId)
            .update({
              users: r.row('users').append(user_id),
            });

        setLocals({
          organizationId,
          user_id,
        });

        return db.rethinkQuery(updateQ);
      }

      return next(new SwipesError('Invalid invitation code'));
    })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const userSignUp = valLocals('userSignUp', {
  user_id: string.require(),
  email: string.format('email').require(),
  first_name: string.require(),
  last_name: string.require(),
  password: string.min(1).require(),
  organizationId: string.require(),
  tokenInfo: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    email,
    first_name,
    last_name,
    password,
    organizationId,
    tokenInfo,
  } = res.locals;
  const userDoc = {
    id: user_id,
    apps: [],
    services: [],
    organizations: [organizationId],
    email,
    first_name,
    last_name,
    password: sha1(password),
    created: moment().unix(),
  };
  const tokens = createTokens(tokenInfo.user_id);
  const createUserQ = r.table('users').insert(userDoc);

  Promise.all([
    dbTokensInsertSingle({ token: tokens.token, tokenInfo }),
    db.rethinkQuery(createUserQ),
  ])
  .then(() => {
    setLocals({
      user_id,
      token: tokens.shortToken,
    });

    return next();
  })
  .catch((err) => {
    return next(err);
  });
});
const usersGetByEmailSignIn = valLocals('usersGetByEmailSignIn', {
  email: string.format('email').require(),
}, (req, res, next, setLocals) => {
  const {
    email,
  } = res.locals;

  dbUsersGetByEmailForSignIn({ email })
    .then((users) => {
      if (users.length === 0) {
        return next(new SwipesError('Wrong email or password'));
      }

      const user = users[0];

      setLocals({
        user,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersComparePasswordSignIn = valLocals('usersComparePasswordSignIn', {
  user: object.require(),
  password: string.min(1).require(),
}, (req, res, next, setLocals) => {
  const {
    user,
    password,
  } = res.locals;
  const sha1Password = sha1(password);

  if (sha1Password !== user.password) {
    return next(new SwipesError('Wrong email or password'));
  }

  return next();
});
const userSignIn = valLocals('userSignIn', {
  tokenInfo: object.require(),
}, (req, res, next, setLocals) => {
  const {
    tokenInfo,
  } = res.locals;

  const tokens = createTokens(tokenInfo.user_id);

  setLocals({
    token: tokens.shortToken,
  });

  dbTokensInsertSingle({ token: tokens.token, tokenInfo })
    .then((results) => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersGetService = valLocals('usersGetService', {
  user_id: string.require(),
  account_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    account_id,
  } = res.locals;

  return dbUsersGetService(user_id, account_id)
    .then((service) => {
      if (service === null) {
        return next(new SwipesError('There is no such service'));
      }

      setLocals({
        service,
      });

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
}, (req, res, next, setLocals) => {
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

      setLocals({
        xendoUserServiceId,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersRemoveXendoService = valLocals('usersRemoveXendoService', {
  xendoUserServiceId: number,
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
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;

  return dbUsersGetSingleWithOrganizations({ user_id })
    .then((user) => {
      setLocals({
        user,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const userGetInfoForToken = valLocals('userGetInfoForToken', {
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;
  const platform = req.header('sw-platform');
  const ip = getClientIp(req);
  const revoked = false;

  setLocals({
    tokenInfo: {
      user_id,
      revoked,
      info: {
        platform,
        ip,
      },
    },
  });

  return next();
});
const usersRevokeToken = valLocals('usersRevokeToken', {
  user_id: string.require(),
  dbToken: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    dbToken,
  } = res.locals;

  dbTokensRevoke({ user_id, dbToken })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  usersComparePasswordSignIn,
  usersGetByEmailSignIn,
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
  userGetInfoForToken,
  usersRevokeToken,
};
