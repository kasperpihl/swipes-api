import express from 'express';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  goalsUpdate,
  goalsCreate,
  goalsGet,
  goalsDelete,
  goalsAddMilestone,
  goalsRemoveMilestone,
  goalsInsert,
  goalsCreateQueueMessage,
  goalsDeleteQueueMessage,
  goalsAddMilestoneQueueMessage,
  goalsRemoveMilestoneQueueMessage,
  goalsCompleteStep,
  goalsNextStepQueueMessage,
  goalsStepGotActiveQueueMessage,
} from './middlewares/goals';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  usersGetSingleWithOrganizations,
} from './middlewares/users';
import {
  notifyAllInCompany,
  notifyCommonRethinkdb,
} from './middlewares/notify';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/goals.create',
  valBody({
    goal: object.as({
      title: string.require(),
      steps: object.of(object.as({
        id: string.require(),
        title: string.require(),
        assignees: array.of(string).require(),
      })).require(),
      step_order: array.of(string).require(),
      attachments: object.require(),
      attachment_order: array.of(string).require(),
    }).require(),
    organization_id: string.require(),
    message: string,
    flags: array.of(string),
  }),
  goalsCreate,
  goalsInsert,
  goalsCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    data: object.require(),
  }));

authed.all('/goals.completeStep',
    valBody({
      goal_id: string.require(),
      current_step_id: string.require(),
      next_step_id: string,
      message: string,
      flags: array.of(string),
    }),
    goalsGet,
    goalsCompleteStep,
    goalsUpdate,
    goalsNextStepQueueMessage,
    notificationsPushToQueue,
    goalsStepGotActiveQueueMessage,
    notificationsPushToQueue,
    valResponseAndSend({
      goal: object.require(),
    }));

authed.all('/goals.delete',
  valBody({
    goal_id: string.require(),
  }),
  goalsDelete,
  goalsDeleteQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    id: string.require(),
  }));

authed.all('/goals.addMilestone',
  valBody({
    id: string.require(),
    milestone_id: string.require(),
  }),
  goalsAddMilestone,
  goalsAddMilestoneQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    id: string.require(),
    milestone_id: string.require(),
  }));

authed.all('/goals.removeMilestone',
  valBody({
    id: string.require(),
  }),
  goalsRemoveMilestone,
  goalsRemoveMilestoneQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    id: string.require(),
    milestone_id: string.require(),
  }));

// T_TODO warning: this endpoint is to be removed
authed.all('/goals.update',
    usersGetSingleWithOrganizations,
    goalsUpdate,
    notifyAllInCompany,
    notifyCommonRethinkdb,
    valResponseAndSend({
      goal: object.require(),
    }));

export {
  authed,
  notAuthed,
};
