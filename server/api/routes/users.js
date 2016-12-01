import express from 'express';
import {
  validateSignUp,
  validateSignIn,
} from '../validators/users';
import {
  validateGetServiceFromUser,
} from '../validators/services';
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
  validateSignIn,
  userSignIn,
  (req, res) => {
    const {
    token,
  } = res.locals;

    res.status(200).json({ ok: true, token });
  });

notAuthed.all('/users.signup',
  validateSignUp,
  userAvailability,
  userAddToOrganization,
  userSignUp,
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserSignUp,
  (req, res) => {
    const {
      user_id,
      token,
    } = res.locals;

    res.status(200).json({ ok: true, userId: user_id, token });
  },
);

authed.post('/users.serviceDisconnect',
  validateGetServiceFromUser,
  usersGetService,
  usersCleanupRegisteredWebhooksToService,
  usersGetXendoServiceId,
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoRemoveServiceFromUser,
  usersRemoveXendoService,
  usersRemoveService,
  (req, res) => {
    return res.status(200).json({ ok: true });
  });

// T_TODO
// that's a hack that we will remove Sunday
// DELETE THIS AS SOON AS POSSIBLE
authed.post('/users.profilePic',
  usersUpdateProfilePic,
  (req, res) => {
    return res.status(200).json({ ok: true });
  });

export {
  notAuthed,
  authed,
};
