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
  userSignupQueueMessage,
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
  mapLocals(locals => ({
    email: locals.email.toLowerCase(),
  })),
  mapLocals(() => ({
    fields: ['id', 'password'],
    passwordError: 'Wrong email or password',
  })),
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
  mapLocals(locals => ({
    email: locals.email.toLowerCase(),
  })),
  userAvailability,
  usersParseInvitationToken,
  usersActivateUserSignUp,
  userActivatedUserSignUpQueueMessage,
  notificationsPushToQueue,
  userGetInfoForToken,
  userSignUp,
  mapLocals(locals => ({
    user_id: locals.userId,
  })),
  organizationsCreate,
  organizationsAddToUser,
  userSignupQueueMessage,
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
  mapLocals(locals => ({
    email: locals.email.toLowerCase(),
  })),
  mapLocals(() => ({
    fields: [],
  })),
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
  mapLocals(locals => ({
    email: locals.email.toLowerCase(),
  })),
  mapLocals(() => ({
    fields: ['id'],
  })),
  usersGetByEmailWithFields,
  mapLocals(locals => ({
    user_id: locals.user.id,
    settings: {
      subscriptions: {
        goal_notify: false,
      },
    },
  })),
  meUpdateSettings,
  meUpdateSettingsQueueMessage,
  notificationsPushToQueue,
  sendResponse,
);

export {
  notAuthed,
  authed,
};
