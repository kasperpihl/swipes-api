"use strict";

import express from 'express';
import {
  signUpValidate,
  userAvailability,
  userSignUp,
  signInValidate,
  userSignIn
} from '../middlewares/users_signup_signin.js';

const router = express.Router();

router.post('/users.login', signInValidate, userSignIn);
router.post('/users.create', signUpValidate, userAvailability, userSignUp);

module.exports = router;
