"use strict";

import express from 'express';
import {
  signUpValidate,
  userAvailability,
  userSignUp,
  signInValidate,
  userSignIn
} from '../middlewares/users_signup_signin.js';
import {
  xendoSwipesCredentials,
  xendoRefreshSwipesToken,
  xendoUserSignUp
} from '../middlewares/xendo.js';

const router = express.Router();

router.post('/users.signin', signInValidate, userSignIn, (req, res, next) => {
  const {
    token
  } = res.locals;

  res.status(200).json({ok: true, token});
});

router.post('/users.signup',
  signUpValidate,
  userAvailability,
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

module.exports = router;
