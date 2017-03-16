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
  (req, res, next) => {
    res.locals.text = res.locals.note_content;

    return next();
  },
  notesCreate,
  // Some mapping so we can add the note as an attachment to the goal
  (req, res, next) => {
    const {
      user_id,
      note,
    } = res.locals;

    res.locals.link = {
      service: {
        id: note.id,
        name: 'swipes',
        type: 'note',
      },
      permission: {
        account_id: user_id,
      },
      meta: {
        title: 'Note',
      },
    };

    return next();
  },
  linksCreate,
  linksAddPermission,
  attachmentsCreate,
  goalsCreate,
  goalsInsert,
  (req, res, next) => {
    const {
      goal,
    } = res.locals;
    res.locals.target_id = goal.id;

    return next();
  },
  attachmentsInsert,
  (req, res, next) => {
    const {
      attachment,
      attachment_order,
      goal,
    } = res.locals;

    goal.attachments[attachment.id] = attachment;
    goal.attachment_order = attachment_order;

    return next();
  },
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
  (req, res, next) => {
    res.locals.goalProgress = 'start';
    return next();
  },
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
  notificationCreateGroupId,
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
