import express from 'express';
import {
  validateStepsSubmit,
  validateStepsUpdate,
} from '../validators/steps';
import {
  stepsGetCurrent,
  stepsSubmit,
  stepsGet,
  stepsUpdateData,
} from './middlewares/steps';
import {
  goalsGet,
  goalsNext,
  goalsUpdate,
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

authed.post('/steps.submit',
  validateStepsSubmit,
  goalsGet,
  stepsGetCurrent,
  stepsSubmit,
  goalsNext,
  goalsUpdate,
  usersGetSingleWithOrganizations,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res) => res.status(200).json({ ok: true }),
);

authed.post('/steps.update',
  validateStepsUpdate,
  usersGetSingleWithOrganizations,
  goalsGet,
  stepsGet,
  stepsUpdateData,
  notifyAllInCompany,
  notifyCommonRethinkdb,
  (req, res) => res.status(200).json({ ok: true }),
);

export {
  authed,
  notAuthed,
};
