"use strict";

import express from 'express';
import {
  validateSignUp,
  validateSignIn
} from '../validators/users';
import {
  userAvailability,
  userAddToOrganization,
  userSignUp,
  userSignIn
} from './middlewares/users';
import {
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserSignUp
} from './middlewares/xendo.js';

const authed = express.Router();
const notAuthed = express.Router();

notAuthed.all('/users.signin',
  validateSignIn,
  userSignIn,
  (req, res, next) => {
  const {
    token
  } = res.locals;

  res.status(200).json({ok: true, token});
});

notAuthed.all('/users.signup',
  validateSignUp,
  userAvailability,
  userAddToOrganization,
  userSignUp,
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserSignUp,
  (req, res, next) => {
    const {
      userId,
      token
    } = res.locals;

    res.status(200).json({ok: true, userId, token});
  }
);

export {
  notAuthed,
  authed
}
