import express from 'express';
import {
  string,
  object,
  array,
  bool,
} from 'valjs';
import {
  valBody,
  valResponseAndSend,
} from '../utils';
import {
  goalMoreStrict,
} from '../validators';
import {
  goalsUpdate,
  goalsCreate,
  goalsGet,
  goalsArchive,
  goalsAddMilestone,
  goalsRemoveMilestone,
  goalsInsert,
  goalsCreateQueueMessage,
  goalsArchiveQueueMessage,
  goalsAddMilestoneQueueMessage,
  goalsRemoveMilestoneQueueMessage,
  goalsCompleteStep,
  goalsNextStepQueueMessage,
  goalsProgressStatus,
  goalsNotifyQueueMessage,
  goalsNotify,
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
    goal: goalMoreStrict,
    organization_id: string.require(),
    message: string,
    flags: array.of(string),
  }),
  goalsCreate,
  goalsInsert,
  goalsCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

authed.all('/goals.completeStep',
    valBody({
      goal_id: string.require(),
      current_step_id: string.require(),
      next_step_id: string,
      message: string,
      flags: array.of(string),
      assignees: array.of(string),
    }),
    goalsGet,
    goalsCompleteStep,
    goalsProgressStatus,
    goalsUpdate,
    goalsNextStepQueueMessage,
    notificationsPushToQueue,
    valResponseAndSend({
      goal: object.require(),
    }));

authed.all('/goals.archive',
  valBody({
    goal_id: string.require(),
  }),
  goalsArchive,
  goalsArchiveQueueMessage,
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

// T_TODO think about how to overcome the 256KB limit of the message to the queue
// K_SOLUTION limit message length (don't write a book to people :)
// T_ANSWER uh.. I have to check the message size before send it to the queue
// and throw a proper error :D
authed.all('/goals.notify',
  valBody({
    goal_id: string.require(),
    assignees: array.of(string).min(1).require(),
    feedback: bool,
    current_step_id: string,
    flags: array.of(string),
    message: string,
  }),
  goalsNotify,
  goalsNotifyQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
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
