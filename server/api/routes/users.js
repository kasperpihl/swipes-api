import express from 'express';
import {
  string,
  any,
} from 'valjs';
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
  usersCreateConfirmationToken,
  usersActivateUserSignUp,
  userSignupQueueMessage,
  usersParseInvitationToken,
  usersParseConfirmationToken,
  userCheckEmailVsTokenEmail,
  usersConfirmEmail,
  usersConfirmEmailQueueMessage,
} from './middlewares/users';
import {
  meUpdateSettings,
  meUpdateSettingsQueueMessage,
} from './middlewares/me';
import {
  xendoRemoveServiceFromUserQueueMessage,
} from './middlewares/xendo';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  valBody,
  sendResponse,
  valResponseAndSend,
  mapLocals,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all(
  '/users.signin',
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
  }),
);

notAuthed.all(
  '/users.signup',
  valBody({
    email: string.format('email').require(),
    password: string.min(1).require(),
    first_name: string.max(32).require(),
    last_name: string.max(32).require(),
    invitation_token: string,
  }),
  mapLocals(locals => ({
    email: locals.email.toLowerCase(),
  })),
  usersParseInvitationToken,
  userCheckEmailVsTokenEmail,
  userAvailability,
  usersActivateUserSignUp,
  userGetInfoForToken,
  userSignUp,
  mapLocals(locals => ({
    user_id: locals.userId,
  })),
  usersCreateConfirmationToken,
  mapLocals(locals => ({
    confirmation_token: locals.confirmationToken,
  })),
  userSignupQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    user_id: string.require(),
    token: string.require(),
  }),
);

authed.all(
  '/users.signout',
  usersRevokeToken,
  valResponseAndSend(),
);

authed.post(
  '/users.serviceDisconnect',
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

authed.all(
  '/users.resendConfirmEmail',
  valBody({
    confirmation_token: string.require(),
  }),
  usersCreateConfirmationToken,
  mapLocals(locals => ({
    confirmation_token: locals.confirmationToken,
  })),
  userSignupQueueMessage,
  notificationsPushToQueue,
  sendResponse,
);

notAuthed.all(
  '/users.confirmEmail',
  valBody({
    confirmation_token: string.require(),
  }),
  usersParseConfirmationToken,
  mapLocals(locals => ({
    user_id: locals.userId,
  })),
  usersConfirmEmail,
  usersConfirmEmailQueueMessage,
  notificationsPushToQueue,
  sendResponse,
);

notAuthed.all(
  '/users.unsubscribe',
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
      subscriptions: {},
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
