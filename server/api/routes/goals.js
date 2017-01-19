import express from 'express';
import {
  string,
  object,
} from 'valjs';
import {
  valBody,
} from '../utils';
import {
  goalsUpdateData,
  goalsCreate,
  goalsDelete,
  goalsAddMilestone,
  goalsRemoveMilestone,
  goalsNext,
  goalsInsert,
  goalsCreateQueueMessage,
  goalsDeleteQueueMessage,
  goalsAddMilestoneQueueMessage,
  goalsRemoveMilestoneQueueMessage,
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
  valBody({
    goal: object.require(), // T_TODO make it shape when it's more final
    organization_id: string.require(),
    workflow_id: string,
  }),
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
  valBody({
    goal_id: string.require(),
  }),
  goalsDelete,
  goalsDeleteQueueMessage,
  notificationsPushToQueue,
  (req, res) => {
    const {
      goal_id,
    } = res.locals;

    return res.status(200).json({ ok: true, id: goal_id });
  });

authed.all('/goals.addMilestone',
  valBody({
    id: string.require(),
    milestone_id: string.require(),
  }),
  goalsAddMilestone,
  goalsAddMilestoneQueueMessage,
  notificationsPushToQueue,
  (req, res) => {
    const {
      id,
      milestone_id,
    } = res.locals;

    return res.status(200).json({ ok: true, id, milestone_id });
  });

authed.all('/goals.removeMilestone',
  valBody({
    id: string.require(),
  }),
  goalsRemoveMilestone,
  goalsRemoveMilestoneQueueMessage,
  notificationsPushToQueue,
  (req, res) => {
    const {
      id,
    } = res.locals;

    return res.status(200).json({ ok: true, id });
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
