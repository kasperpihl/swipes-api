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
  dbUsersUpdateProfilePic,
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
const defaultOnBoardingSettings = {
  onboarding: {
    order: [
      'create-account',
      'personalize-swipes',
      'create-goal',
      'watch-introduction-video',
      'invite-team',
    ],
    completed: {
      'create-account': true,
    },
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

  if (invitation_token) {
    return next();
  }

  const query = r.table('users').getAll(email, { index: 'email' }).isEmpty();

  return db.rethinkQuery(query)
    .then((result) => {
      if (!result) {
        return next(new SwipesError('There is a user with that email'));
      }

      const user_id = generateSlackLikeId('U');

      setLocals({
        user_id,
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

  if (!invitation_token) {
    return next();
  }

  try {
    const content = jwt.decode(invitation_token, invitationTokenSecret);

    setLocals({
      user_id: content.user_id,
      organization_id: content.organization_id,
    });

    return next();
  } catch (err) {
    return next(new SwipesError('Invalid invitation token'));
  }
});
const usersActivateUserSignUp = valLocals('usersActivateUserSignUp', {
  user_id: string.require(),
  password: string.min(1).require(),
  first_name: string.max(32).require(),
  last_name: string.max(32).require(),
  invitation_token: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    password,
    first_name,
    last_name,
    invitation_token,
  } = res.locals;

  if (!invitation_token) {
    return next();
  }

  const passwordSha1 = sha1(password);

  return dbUsersActivateAfterSignUp({
    user_id,
    first_name,
    last_name,
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
  user_id: string.require(),
  email: string.format('email').require(),
  first_name: string.require(),
  last_name: string.require(),
  password: string.min(1).require(),
  tokenInfo: object.require(),
  invitation_token: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    email,
    first_name,
    last_name,
    password,
    tokenInfo,
    invitation_token,
  } = res.locals;

  if (invitation_token) {
    return next();
  }

  const userDoc = {
    id: user_id,
    services: [],
    organizations: [],
    email,
    first_name,
    last_name,
    password: sha1(password),
    created_at: r.now(),
    updated_at: r.now(),
    settings: defaultOnBoardingSettings,
    activated: true,
  };
  const tokens = createTokens(tokenInfo.user_id);

  return Promise.all([
    dbTokensInsertSingle({ token: tokens.token, tokenInfo }),
    dbUsersCreate({ user: userDoc }),
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
const userActivatedUserSignUpQueueMessage = valLocals('userActivatedUserSignUpQueueMessage', {
  user: object.require(),
  invitation_token: string,
  organization_id: string,
}, (req, res, next, setLocals) => {
  const {
    user,
    invitation_token,
  } = res.locals;

  if (!invitation_token) {
    return next();
  }

  const user_id = user.id;
  const queueMessage = {
    user_id,
    event_type: 'user_activated',
  };

  setLocals({
    queueMessage,
    messageGroupId: user_id,
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
}, (req, res, next, setLocals) => {
  const {
    user,
    password,
  } = res.locals;
  const sha1Password = sha1(password);

  if (!user || sha1Password !== user.password) {
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

  dbTokensRevoke({ user_id, token: dbToken })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const usersCreateTempUnactivatedUser = valLocals('usersCreateTempUnactivatedUser', {
  organization_id: string.require(),
  first_name: string.require(),
  email: string.require(),
  user: object,
}, (req, res, next, setLocals) => {
  const {
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
    first_name,
    created_at: r.now(),
    updated_at: r.now(),
    settings: defaultOnBoardingSettings,
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
  const user_id = user.id;
  const invitationToken = jwt.encode({
    user_id,
    organization_id,
  }, invitationTokenSecret);

  setLocals({
    invitationToken,
  });

  return next();
});
const usersSendInvitationQueueMessage = valLocals('usersSendInvitationQueueMessage', {
  email: string.require(),
  invitationToken: string.require(),
  user: object.require(),
}, (req, res, next, setLocals) => {
  const {
    email,
    invitationToken,
    user,
  } = res.locals;

  if (user.organizations.length > 0) {
    return next(new SwipesError('This user is already in another organization.'));
  }

  const user_id = user.id;
  const first_name = user.first_name;
  const queueMessage = {
    email,
    invitationToken,
    first_name,
    event_type: 'user_invitation_email',
  };

  setLocals({
    queueMessage,
    messageGroupId: user_id,
  });

  return next();
});
const usersInvitedUserQueueMessage = valLocals('usersInvitedUserQueueMessage', {
  user: object.require(),
  organization: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user,
    organization,
  } = res.locals;

  const user_id = user.id;
  const queueMessage = {
    user_id,
    organization,
    event_type: 'user_invited',
  };

  setLocals({
    queueMessage,
    messageGroupId: user_id,
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
  usersUpdateProfilePic,
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
};
