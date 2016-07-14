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
  xendoCredentials,
  xendoUserSignUp
} from '../middlewares/xendo.js';

const router = express.Router();

router.post('/users.login', signInValidate, userSignIn, (req, res, next) => {
  const {
    token
  } = res.locals;

  res.status(200).json({ok: true, token});
});

router.post('/users.create', signUpValidate, userAvailability, userSignUp, xendoCredentials, xendoUserSignUp, (req, res, next) => {
  const {
    userId,
    token
  } = res.locals;

  res.status(200).json({ok: true, userId, token});
});

module.exports = router;
