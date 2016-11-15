"use strict";

import express from 'express';
import {
  stepsGetCurrent,
  stepsValidateSubmit,
  stepsSubmit,
  stepsGet,
  stepsValidateUpdateData,
  stepsUpdateData,
  stepsUpdateRethinkdb
} from '../middlewares/steps';
import {
  goalsGet,
  goalsNext,
  goalsUpdate
} from '../middlewares/goals';
import {
  notifyAllInCompany,
  notifyCommonRethinkdb
} from '../middlewares/notify';
import {
  usersGet
} from '../middlewares/users';

const router = express.Router();

router.post('/steps.submit',
  stepsValidateSubmit,
  goalsGet,
  stepsGetCurrent,
  stepsSubmit,
  goalsNext,
  goalsUpdate,
  usersGet,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res, next) => res.status(200).json({ok:true})
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

module.exports = router;
