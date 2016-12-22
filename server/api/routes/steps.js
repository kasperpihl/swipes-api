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
  goalsNextStepQueueMessage,
  goalsStepGotActiveQueueMessage,
} from './middlewares/goals';
import {
  notifyAllInCompany,
  notifyCommonRethinkdb,
} from './middlewares/notify';
import {
  usersGetSingleWithOrganizations,
} from './middlewares/users';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';

const authed = express.Router();
const notAuthed = express.Router();

authed.post('/steps.submit',
  validateStepsSubmit,
  goalsGet,
  stepsGetCurrent,
  stepsSubmit,
  goalsNext,
  goalsUpdate,
  goalsNextStepQueueMessage,
  notificationsPushToQueue,
  goalsStepGotActiveQueueMessage,
  notificationsPushToQueue,
  (req, res, next) => {
    const {
      goal,
    } = res.locals;

    res.status(200).json({ ok: true, goal });
  },
);

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
