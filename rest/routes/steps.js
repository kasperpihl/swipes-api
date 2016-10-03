"use strict";

import express from 'express';
import {
  stepsAssignValidate,
  stepsAssign,
  stepsValidateDoAction,
  stepsDo
} from '../middlewares/steps';
import {
  goalsGet
} from '../middlewares/goals';

const router = express.Router();

router.post('/steps.assign',
  stepsAssignValidate,
  stepsAssign,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  }
)

router.post('/steps.do',
  stepsValidateDoAction,
  goalsGet,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  }
)

module.exports = router;
