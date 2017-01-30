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
} from './middlewares/users';
import {
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserSignUp,
  xendoRemoveServiceFromUser,
} from './middlewares/xendo';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/users.signin',
  valBody({
    email: string.format('email').require(),
    password: string.min(1).require(),
  }),
  userSignIn,
  valResponseAndSend({
    token: string.require(),
  }));

notAuthed.all('/users.signup',
  valBody({
    email: string.format('email').require(),
    password: string.min(1).require(),
    name: string.max(32).require(),
    organization: string.max(64).require(),
    invitation_code: string.custom((value) => {
      return value.startsWith('SW319-') ? null : 'Invalid invitation code';
    }).require(),
  }),
  userAvailability,
  userAddToOrganization,
  userSignUp,
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserSignUp,
  valResponseAndSend({
    user_id: string.require(),
    token: string.require(),
  }));

authed.post('/users.serviceDisconnect',
  valBody({
    account_id: string.require(),
  }),
  usersGetService,
  usersCleanupRegisteredWebhooksToService,
  usersGetXendoServiceId,
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoRemoveServiceFromUser,
  usersRemoveXendoService,
  usersRemoveService,
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
