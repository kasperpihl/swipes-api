"use strict";

import express from 'express';

import {
  validateGoalsCreate,
  validateGoalsDelete
} from '../validators/goals';
import {
  goalsCreate,
  goalsDelete,
  goalsNext,
  goalsInsert
} from './middlewares/goals';
import {
  usersGetSingleWithOrganizations
} from './middlewares/users';
import {
  notifyAllInCompany,
  notifyCommonRethinkdb
} from './middlewares/notify';
import {
  processesGetAllOrderedByTitle
} from './middlewares/db_utils/processes'

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/goals.processes', (req, res, next) => {
  processesGetAllOrderedByTitle()
    .then((processes) => {
      return res.status(200).json({ok: true, data: processes});
    })
    .catch((err) => {
      return next(err);
    })
})

authed.all('/goals.create',
  validateGoalsCreate,
  usersGetSingleWithOrganizations,
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

authed.all('/goals.delete',
  validateGoalsDelete,
  usersGetSingleWithOrganizations,
  goalsDelete,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res, next) => {
    return res.status(200).json({ok: true});
  })

export {
  authed,
  notAuthed
}
