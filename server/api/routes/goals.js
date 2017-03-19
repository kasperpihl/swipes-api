import express from 'express';
import {
  string,
  object,
  array,
  bool,
} from 'valjs';
import {
  valBody,
  mapLocals,
  valResponseAndSend,
  getSwipesLinkObj,
} from '../utils';
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
  goalsRename,
  goalsRenameQueueMessage,
  goalsLoadWay,
  goalsLoadWayQueueMessage,
} from './middlewares/goals';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  notificationCreateGroupId,
} from './middlewares/util_middlewares';
import {
  usersGetSingleWithOrganizations,
} from './middlewares/users';
import {
  notifyAllInCompany,
  notifyCommonRethinkdb,
} from './middlewares/notify';
import {
  notesCreate,
} from './middlewares/notes';
import {
  waysGetSingle,
} from './middlewares/ways';
import {
  linksAddPermission,
  linksCreate,
} from './middlewares/links';
import {
  attachmentsCreate,
  attachmentsInsert,
} from './middlewares/attachments';

const authed = express.Router();
const notAuthed = express.Router();

authed.all('/goals.create',
  valBody({
    goal: object.as({
      title: string.min(1).require(),
    }).require(),
    organization_id: string.require(),
    note_content: object.require(),
  }),
  mapLocals('note_content', (setLocals, note_content) => {
    setLocals({ text: note_content });
  }),
  notesCreate,
  // Some mapping so we can add the note as an attachment to the goal
  mapLocals(['note', 'user_id'], (setLocals, note, user_id) => {
    setLocals({ link: getSwipesLinkObj('note', note.id, 'Description', user_id) });
  }),
  linksCreate,
  linksAddPermission,
  attachmentsCreate,
  goalsCreate,
  goalsInsert,
  mapLocals('goal', (setLocals, goal) => {
    setLocals({ target_id: goal.id });
  }),
  attachmentsInsert,
  mapLocals(
    ['attachment', 'attachment_order', 'goal'],
    (setLocals, attachment, attachment_order, goal) => {
      goal.attachments[attachment.id] = attachment;
      goal.attachment_order = attachment_order;
      setLocals({ goal });
    },
  ),
  goalsCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

authed.all('/goals.start',
  valBody({
    goal_id: string.require(),
    current_step_id: string,
    next_step_id: string,
    message: string,
    flags: array.of(string),
    assignees: array.of(string),
  }),
  notificationCreateGroupId,
  goalsGet,
  mapLocals([], (setLocals) => {
    setLocals({ goalProgress: 'start' });
  }),
  goalsCompleteStep,
  goalsUpdate,
  goalsNextStepQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

authed.all('/goals.completeStep',
  valBody({
    goal_id: string.require(),
    current_step_id: string,
    next_step_id: string,
    message: string,
    flags: array.of(string),
    assignees: array.of(string),
  }),
  notificationCreateGroupId,
  goalsGet,
  goalsProgressStatus,
  goalsCompleteStep,
  goalsUpdate,
  goalsNextStepQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

authed.all('/goals.rename',
  valBody({
    goal_id: string.require(),
    title: string.min(1).require(),
  }),
  goalsRename,
  goalsRenameQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    title: string.require(),
  }));

authed.all('/goals.archive',
  valBody({
    goal_id: string.require(),
  }),
  notificationCreateGroupId,
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
  notificationCreateGroupId,
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
  notificationCreateGroupId,
  goalsRemoveMilestone,
  goalsRemoveMilestoneQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    id: string.require(),
    milestone_id: string.require(),
  }));

authed.all('/goals.notify',
  valBody({
    goal_id: string.require(),
    assignees: array.of(string).min(1).require(),
    feedback: bool,
    current_step_id: string,
    flags: array.of(string),
    message: string,
  }),
  notificationCreateGroupId,
  goalsNotify,
  goalsNotifyQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

authed.all('/goals.loadWay',
  valBody({
    goal_id: string.require(),
    way_id: string,
    way: object,
  }),
  waysGetSingle,
  goalsLoadWay,
  goalsLoadWayQueueMessage,
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
