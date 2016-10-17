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
  //stepsIterate
} from '../middlewares/steps';
import {
  goalsGet
} from '../middlewares/goals';
import {
  notifyAllInCompany,
  notifyCommonRethinkdb
} from '../middlewares/notify';
import {
  usersGet
} from '../middlewares/users';

const router = express.Router();

router.post('/steps.assign',
  stepsAssignValidate,
  usersGet,
  stepsAssign,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  }
)

router.post('/steps.do',
  stepsValidateDoAction,
  usersGet,
  goalsGet,
  stepsGetCurrent,
  stepsDo,
  stepsUpdateRethinkdb,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  }
)

router.post('/steps.update',
  stepsValidateUpdateData,
  usersGet,
  goalsGet,
  stepsGet,
  stepsUpdateData,
  stepsUpdateRethinkdb,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  }
)

router.post('/steps.next',
  usersGet,
  goalsGet,
  stepsGetCurrent,
  //stepsIterate,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  }
)

module.exports = router;
