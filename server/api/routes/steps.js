import express from 'express';
import {
  validateStepsUpdate,
} from '../validators/steps';
import {
  stepsGet,
  stepsUpdateData,
} from './middlewares/steps';
import {
  goalsGet,
} from './middlewares/goals';
import {
  notifyAllInCompany,
  notifyCommonRethinkdb,
} from './middlewares/notify';
import {
  usersGetSingleWithOrganizations,
} from './middlewares/users';

const authed = express.Router();
const notAuthed = express.Router();

authed.post('/steps.update',
  validateStepsUpdate,
  usersGetSingleWithOrganizations,
  goalsGet,
  stepsGet,
  stepsUpdateData,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res, next) => res.status(200).json({ ok: true }),
);

export {
  authed,
  notAuthed,
};
