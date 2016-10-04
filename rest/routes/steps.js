"use strict";

import express from 'express';
import {
  stepsAssignValidate,
  stepsAssign,
  stepsGetCurrent,
  stepsValidateDoAction,
  stepsDo,
  stepsGet,
  stepsValidateUpdateData,
  stepsUpdateData,
  stepsUpdateRethinkdb
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
  stepsGetCurrent,
  stepsDo,
  stepsUpdateRethinkdb,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  }
)

router.post('/steps.update',
  stepsValidateUpdateData,
  goalsGet,
  stepsGet,
  stepsUpdateData,
  stepsUpdateRethinkdb,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  }
)

module.exports = router;
