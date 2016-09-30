"use strict";

import express from 'express';
import {
  stepsAssignValidate,
  stepsAssign
} from '../middlewares/steps';

const router = express.Router();

router.post('/steps.assign',
  stepsAssignValidate,
  stepsAssign,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  }
)

module.exports = router;
