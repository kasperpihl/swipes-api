import express from 'express';
import {
  string,
} from 'valjs';
import {
  valBody,
  sendResponse,
  valResponseAndSend,
} from '../utils';
import {
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
  userGetInfoForToken,
  usersGetByEmailSignIn,
  usersComparePasswordSignIn,
  usersRevokeToken,
} from './middlewares/users';
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
  usersGetByEmailSignIn,
  usersComparePasswordSignIn,
  (req, res, next) => {
    const {
      user,
    } = res.locals;

    res.locals.user_id = user.id;

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
    invitation_code: string.require(),
  }),
  userAvailability,
  userAddToOrganization,
  userGetInfoForToken,
  userSignUp,
  xendoSignUpQueueMessage,
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

// T_TODO
// that's a hack that we will remove Sunday
// DELETE THIS AS SOON AS POSSIBLE
authed.post('/users.profilePic',
  usersUpdateProfilePic,
  sendResponse,
);

export {
  notAuthed,
  authed,
};
