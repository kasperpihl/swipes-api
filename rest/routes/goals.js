"use strict";

import express from 'express';
import r from 'rethinkdb';
import db from '../db.js';
import {
  goalsValidate,
  goalsCreate,
  goalsDelete,
  goalsNext,
  goalsInsert
} from '../middlewares/goals';
import {
  usersGet
} from '../middlewares/users';
import {
  notifyAllInCompany,
  notifyCommonRethinkdb
} from '../middlewares/notify';

const router = express.Router();

router.post('/goals.processes', (req, res, next) => {
  const q = r.table('processes').orderBy('title');

  return db.rethinkQuery(q)
    .then((processes) => {
      return res.status(200).json({ok: true, data: processes});
    })
    .catch((err) => {
      return next(err);
    })
})

router.post('/goals.create',
  usersGet,
  goalsValidate,
  goalsCreate,
  goalsNext,
  goalsInsert,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res, next) => {
    const {
      goalWithMeta
    } = res.locals;

    return res.status(200).json({ok: true, goal: goalWithMeta});
  })

router.post('/goals.delete',
  usersGet,
  goalsDelete,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  })

module.exports = router;
