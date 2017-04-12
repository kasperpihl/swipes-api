import express from 'express';
import {
  string,
  object,
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
  usersUpdateProfilePic,
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
  mapLocals(
  [],
  (setLocals) => {
    const fields = ['id', 'password'];
    setLocals({ fields });
  },
),
  usersGetByEmailWithFields,
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
    invitation_token: string,
  }),
  userAvailability,
  usersParseInvitationToken,
  usersActivateUserSignUp,
  userActivatedUserSignUpQueueMessage,
  notificationsPushToQueue,
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

authed.post('/users.invite',
  valBody({
    organization_id: string.require(),
    first_name: string.require(),
    email: string.require(),
  }),
  mapLocals(
    [],
    (setLocals) => {
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
