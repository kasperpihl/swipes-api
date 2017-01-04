import express from 'express';
import {
  validateGoalsCreate,
  validateGoalsDelete,
} from '../validators/goals';
import {
  goalsUpdateData,
  goalsCreate,
  goalsDelete,
  goalsNext,
  goalsInsert,
  goalsCreateQueueMessage,
  goalsDeleteQueueMessage,
} from './middlewares/goals';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  processesGetAllOrderedByTitle,
} from './middlewares/db_utils/processes';
import {
  usersGetSingleWithOrganizations,
} from './middlewares/users';
import {
  notifyAllInCompany,
  notifyCommonRethinkdb,
} from './middlewares/notify';

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
  goalsCreateQueueMessage,
  notificationsPushToQueue,
  (req, res) => {
    const {
      returnObj,
    } = res.locals;
    return res.status(200).json({ ok: true, ...returnObj });
  });

authed.all('/goals.delete',
  validateGoalsDelete,
  goalsDelete,
  goalsDeleteQueueMessage,
  notificationsPushToQueue,
  (req, res) => {
    const {
      goal_id,
    } = res.locals;

    return res.status(200).json({ ok: true, id: goal_id });
  });

// T_TODO warning: this endpoint is to be removed
authed.all('/goals.update',
    usersGetSingleWithOrganizations,
    goalsUpdateData,
    notifyAllInCompany,
    notifyCommonRethinkdb,
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
