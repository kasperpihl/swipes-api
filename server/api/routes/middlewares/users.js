import r from 'rethinkdb';
import sha1 from 'sha1';
import Promise from 'bluebird';
import jwt from 'jwt-simple';
import {
  string,
  number,
  object,
  array,
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
  dbUsersGetSingleWithOrganizations,
  dbUsersGetByEmailWithFields,
  dbUsersCreate,
  dbUsersActivateAfterSignUp,
} from './db_utils/users';
import {
  dbOrganizationsAddUser,
} from './db_utils/organizations';
import {
  dbTokensInsertSingle,
  dbTokensRevoke,
} from './db_utils/tokens';
import {
  dbXendoGetService,
  dbXendoRemoveService,
} from './db_utils/xendo';

const invitationTokenSecret = 'very_s3cret_invit@tion_secr3t';
const defaultSettings = {
  onboarding: {
    order: [
      'create-account' ,
      'personalize-swipes' ,
      'intro-article',
      'create-milestone',
      'add-goal-milestone' ,
      'article-move-fast-goals',
      'article-collect-feedback',
      'invite-team'
    ],
    completed: {
      'create-account': true,
    },
  },
  starred_goals: [],
  pinned_goals: [],
  subscriptions: {
    goal_notify: true,
  },
};
const userAvailability = valLocals('userAvailability', {
  email: string.format('email').require(),
  invitation_token: string,
}, (req, res, next, setLocals) => {
  const {
    email,
    invitation_token,
  } = res.locals;

  const query = r.table('users').getAll(email, { index: 'email' });

  return db.rethinkQuery(query)
    .then((result) => {
      const user = result[0];

      if (invitation_token && user.activated === false) {
        return next();
      }

      if (user) {
        return next(new SwipesError('There is a user with that email'));
      }

      const userId = generateSlackLikeId('U');

      setLocals({
        userId,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersParseInvitationToken = valLocals('usersParseInvitationToken', {
  invitation_token: string,
}, (req, res, next, setLocals) => {
  const {
    invitation_token,
  } = res.locals;

  if (!invitation_token || invitation_token === 'SW-091959') {
    return next();
  }

  try {
    const content = jwt.decode(invitation_token, invitationTokenSecret);

    setLocals({
      userId: content.user_id,
      organizationId: content.organization_id,
    });

    return next();
  } catch (err) {
    return next(new SwipesError('Invalid invitation token'));
  }
});
const usersActivateUserSignUp = valLocals('usersActivateUserSignUp', {
  userId: string.require(),
  password: string.min(1).require(),
  first_name: string.max(32).require(),
  last_name: string.max(32).require(),
  invitation_token: string,
}, (req, res, next, setLocals) => {
  const {
    userId,
    password,
    first_name,
    last_name,
    invitation_token,
  } = res.locals;

  if (!invitation_token) {
    return next();
  }

  const profile = {
    first_name,
    last_name,
  };
  const passwordSha1 = sha1(password);

  return dbUsersActivateAfterSignUp({
    profile,
    user_id: userId,
    password: passwordSha1,
  })
  .then(() => {
    return next();
  })
  .catch((err) => {
    return next(err);
  });
});
const userSignUp = valLocals('userSignUp', {
  userId: string.require(),
  email: string.format('email').require(),
  first_name: string.require(),
  last_name: string.require(),
  password: string.min(1).require(),
  tokenInfo: object.require(),
  invitation_token: string,
}, (req, res, next, setLocals) => {
  const {
    userId,
    email,
    first_name,
    last_name,
    password,
    tokenInfo,
    invitation_token,
  } = res.locals;

  const tokens = createTokens(tokenInfo.user_id);
  const promises = [
    dbTokensInsertSingle({ token: tokens.token, tokenInfo }),
  ];

  if (!invitation_token) {
    const userDoc = {
      id: userId,
      services: [],
      organizations: [],
      email,
      profile: {
        first_name,
        last_name,
      },
      password: sha1(password),
      created_at: r.now(),
      updated_at: r.now(),
      settings: defaultSettings,
      activated: true,
    };

    promises.push(dbUsersCreate({ user: userDoc }));
  }

  return Promise.all(promises)
  .then(() => {
    setLocals({
      userId,
      token: tokens.shortToken,
    });

    return next();
  })
  .catch((err) => {
    return next(err);
  });
});
const userActivatedUserSignUpQueueMessage = valLocals('userActivatedUserSignUpQueueMessage', {
  userId: string.require(),
  invitation_token: string,
  organization_id: string,
}, (req, res, next, setLocals) => {
  const {
    userId,
    invitation_token,
  } = res.locals;

  if (!invitation_token) {
    return next();
  }

  const queueMessage = {
    user_id: userId,
    event_type: 'user_activated',
  };

  setLocals({
    queueMessage,
    messageGroupId: userId,
  });

  return next();
});
const usersGetByEmailWithFields = valLocals('usersGetByEmailWithFields', {
  email: string.format('email').require(),
  fields: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    email,
    fields,
  } = res.locals;

  dbUsersGetByEmailWithFields({ email, fields })
    .then((users) => {
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
  user: object,
  password: string.min(1).require(),
  passwordError: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user,
    password,
    passwordError,
  } = res.locals;
  const sha1Password = sha1(password);

  if (!user || sha1Password !== user.password) {
    return next(new SwipesError(passwordError));
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
  userId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    userId,
  } = res.locals;
  const platform = req.header('sw-platform') || 'browser';
  const ip = getClientIp(req);
  const revoked = false;

  setLocals({
    tokenInfo: {
      revoked,
      user_id: userId,
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

  dbTokensRevoke({ user_id, token: dbToken })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersCreateTempUnactivatedUser = valLocals('usersCreateTempUnactivatedUser', {
  user_id: string.require(),
  organization_id: string.require(),
  first_name: string.require(),
  email: string.require(),
  user: object,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    first_name,
    email,
    user,
  } = res.locals;
  const userDoc = {
    id: generateSlackLikeId('U'),
    services: [],
    organizations: [organization_id],
    email,
    profile: {
      first_name,
    },
    created_at: r.now(),
    updated_at: r.now(),
    settings: defaultSettings,
    invited_by: user_id,
    activated: false,
  };

  if (!user) {
    return Promise.all([
      dbUsersCreate({ user: userDoc }),
      dbOrganizationsAddUser({ user_id: userDoc.id, organization_id }),
    ])
    .then((results) => {
      const userChanges = results[0].changes[0];
      const organizationChanges = results[1].changes[0];
      const user = userChanges.new_val;
      const organization = organizationChanges.new_val || organizationChanges.old_val;

      setLocals({
        user,
        organization,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
  } else if (user.organizations.length > 0 && user.organizations[0] !== organization_id) {
    return next(new SwipesError('This user is already in another organization.'));
  }

  return next();
});
const usersCreateInvitationToken = valLocals('usersCreateInvitationToken', {
  organization_id: string.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    organization_id,
    user,
  } = res.locals;
  const userId = user.id;
  const invitationToken = jwt.encode({
    organization_id,
    user_id: userId,
  }, invitationTokenSecret);

  setLocals({
    invitationToken,
  });

  return next();
});
const usersSendInvitationQueueMessage = valLocals('usersSendInvitationQueueMessage', {
  user_id: string.require(),
  organization_id: string.require(),
  email: string.require(),
  invitationToken: string.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    organization_id,
    email,
    invitationToken,
    user,
  } = res.locals;

  const userId = user.id;
  const first_name = user.profile.first_name;
  const queueMessage = {
    organization_id,
    email,
    invitationToken,
    first_name,
    inviter_user_id: user_id,
    event_type: 'user_invitation_email',
  };

  setLocals({
    queueMessage,
    messageGroupId: userId,
  });

  return next();
});
const usersInvitedUserQueueMessage = valLocals('usersInvitedUserQueueMessage', {
  user: object.require(),
  organization: object,
}, (req, res, next, setLocals) => {
  const {
    user,
    organization,
  } = res.locals;

  if (!organization) {
    return next();
  }

  const userId = user.id;
  const queueMessage = {
    organization,
    user_id: userId,
    event_type: 'user_invited',
  };

  setLocals({
    queueMessage,
    messageGroupId: userId,
  });

  return next();
});
const userSignupQueueMessage = valLocals('userSubscribeToMailChimpQueueMessage', {
  email: string.format('email').require(),
  organizationId: string.require(),
  first_name: string.require(),
}, (req, res, next, setLocals) => {
  const {
    email,
    organizationId,
    first_name,
  } = res.locals;

  const queueMessage = {
    email,
    first_name,
    organization_id: organizationId,
    event_type: 'user_signup',
  };

  setLocals({
    queueMessage,
    messageGroupId: email,
  });

  return next();
});

export {
  usersComparePasswordSignIn,
  usersGetByEmailWithFields,
  userAvailability,
  userSignUp,
  userSignIn,
  usersGetService,
  usersCleanupRegisteredWebhooksToService,
  usersGetXendoServiceId,
  usersRemoveXendoService,
  usersRemoveService,
  usersGetSingleWithOrganizations,
  userGetInfoForToken,
  usersRevokeToken,
  usersCreateInvitationToken,
  usersCreateTempUnactivatedUser,
  usersSendInvitationQueueMessage,
  usersActivateUserSignUp,
  usersParseInvitationToken,
  userActivatedUserSignUpQueueMessage,
  usersInvitedUserQueueMessage,
  userSignupQueueMessage,
};
