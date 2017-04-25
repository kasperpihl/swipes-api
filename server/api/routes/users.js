import express from 'express';
import {
  string,
  object,
  any,
} from 'valjs';
import {
  valBody,
  sendResponse,
  valResponseAndSend,
  mapLocals,
} from '../utils';
import {
  userAvailability,
  userSignUp,
  userSignIn,
  usersGetService,
  usersCleanupRegisteredWebhooksToService,
  usersGetXendoServiceId,
  usersRemoveXendoService,
  usersRemoveService,
  userGetInfoForToken,
  usersGetByEmailWithFields,
  usersComparePasswordSignIn,
  usersRevokeToken,
  usersCreateInvitationToken,
  usersCreateTempUnactivatedUser,
  usersSendInvitationQueueMessage,
  usersActivateUserSignUp,
  usersParseInvitationToken,
  userActivatedUserSignUpQueueMessage,
  usersInvitedUserQueueMessage,
  userSubscribeToMailChimpQueueMessage,
} from './middlewares/users';
import {
  meUpdateSettings,
  meUpdateSettingsQueueMessage,
} from './middlewares/me';
import {
  organizationsCreate,
  organizationsAddToUser,
} from './middlewares/organizations';
import {
  xendoSignUpQueueMessage,
  xendoRemoveServiceFromUserQueueMessage,
} from './middlewares/xendo';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/users.signin',
  valBody({
    email: string.format('email').require(),
    password: string.min(1).require(),
  }),
  mapLocals(
    [],
    (setLocals) => {
      const fields = ['id', 'password'];
      const passwordError = 'Wrong email or password';
      setLocals({
        fields,
        passwordError,
      });
    },
  ),
  usersGetByEmailWithFields,
  usersComparePasswordSignIn,
  (req, res, next) => {
    const {
      user,
    } = res.locals;

    res.locals.userId = user.id;

    return next();
  },
  userGetInfoForToken,
  userSignIn,
  valResponseAndSend({
    token: string.require(),
  }));

notAuthed.all('/users.signup',
  valBody({
    email: string.format('email').require(),
    password: string.min(1).require(),
    first_name: string.max(32).require(),
    last_name: string.max(32).require(),
    organization_name: string,
    invitation_token: string,
  }),
  userAvailability,
  usersParseInvitationToken,
  usersActivateUserSignUp,
  userActivatedUserSignUpQueueMessage,
  notificationsPushToQueue,
  userGetInfoForToken,
  userSignUp,
  mapLocals(
    ['userId'],
    (setLocals, userId) => {
      setLocals({ user_id: userId });
    },
  ),
  organizationsCreate,
  organizationsAddToUser,
  userSubscribeToMailChimpQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    user_id: string.require(),
    token: string.require(),
  }));

authed.all('/users.signout',
    usersRevokeToken,
    valResponseAndSend(),
  );

authed.post('/users.serviceDisconnect',
  valBody({
    account_id: string.require(),
  }),
  usersGetService,
  usersCleanupRegisteredWebhooksToService,
  usersGetXendoServiceId,
  usersRemoveXendoService,
  usersRemoveService,
  xendoRemoveServiceFromUserQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend(),
);

authed.all('/users.invite',
  valBody({
    organization_id: string.require(),
    first_name: string.require(),
    email: string.require(),
  }),
  mapLocals([], (setLocals) => {
    const fields = [];
    setLocals({ fields });
  },
  ),
  usersGetByEmailWithFields,
  usersCreateTempUnactivatedUser,
  usersCreateInvitationToken,
  usersInvitedUserQueueMessage,
  notificationsPushToQueue,
  usersSendInvitationQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    user: object.require(),
    organization: object,
  }),
);

notAuthed.all('/users.unsubscribe',
  valBody({
    email: string.format('email').require(),
    email_type: any.of('goal_notify'),
  }),
  mapLocals([], (setLocals) => {
    const fields = ['id'];
    setLocals({ fields });
  },
  ),
  usersGetByEmailWithFields,
   mapLocals(
    ['user', 'email_type'],
    (setLocals, user, email_type) => {
      const settings = {
        subscriptions: {
          goal_notify: false,
        },
      };

      setLocals({
        user_id: user.id,
        settings,
      });
    },
  ),
  meUpdateSettings,
  meUpdateSettingsQueueMessage,
  notificationsPushToQueue,
  sendResponse,
);

export {
  notAuthed,
  authed,
};
