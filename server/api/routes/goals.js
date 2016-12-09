import express from 'express';
import {
  validateGoalsCreate,
  validateGoalsDelete,
} from '../validators/goals';
import {
  goalsCreate,
  goalsDelete,
  goalsNext,
  goalsInsert,
  goalsPushToQueue,
} from './middlewares/goals';
import {
  processesGetAllOrderedByTitle,
} from './middlewares/db_utils/processes';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/goals.processes', (req, res, next) => {
  processesGetAllOrderedByTitle()
    .then((processes) => {
      return res.status(200).json({ ok: true, data: processes });
    })
    .catch((err) => {
      return next(err);
    });
});

authed.all('/goals.create',
  validateGoalsCreate,
  goalsCreate,
  goalsNext,
  goalsInsert,
  goalsPushToQueue,
  (req, res) => {
    const {
      goal,
    } = res.locals;

    return res.status(200).json({ ok: true, goal });
  });

authed.all('/goals.delete',
  validateGoalsDelete,
  goalsDelete,
  goalsPushToQueue,
  (req, res) => {
    const {
      goal_id,
    } = res.locals;

    return res.status(200).json({ ok: true, id: goal_id });
  });

export {
  authed,
  notAuthed,
};
