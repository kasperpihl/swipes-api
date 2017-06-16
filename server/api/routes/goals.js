import express from 'express';
import {
  string,
  object,
  array,
  number,
  any,
  bool,
} from 'valjs';
import {
  valBody,
  mapLocals,
  valResponseAndSend,
  getSwipesLinkObj,
} from '../utils';
import {
  goalsCreate,
  goalsArchive,
  goalsInsert,
  goalsCreateQueueMessage,
  goalsArchiveQueueMessage,
  goalsCompleteStep,
  goalsCompleteStepQueueMessage,
  goalsIncompleteStepQueueMessage,
  goalsNotify,
  goalsNotifyQueueMessage,
  goalsHistoryUpdateIfReply,
  goalsRename,
  goalsRenameQueueMessage,
  goalsAppendWayToGoal,
  goalsAppendWayToGoalQueueMessage,
  goalsNotifyEmailQueueMessage,
  goalsIncompleteStep,
  goalsCompleteGoal,
  goalsCompleteQueueMessage,
  goalsIncompleteGoal,
  goalsIncompleteQueueMessage,
} from './middlewares/goals';
import {
  milestonesRemoveGoal,
  milestonesAddGoal,
} from './middlewares/milestones';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
import {
  notificationCreateGroupId,
} from './middlewares/util_middlewares';
import {
  notesCreate,
} from './middlewares/notes';
import {
  waysGetSingle,
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  waysModifyNotesContentInWayAttachments,
} from './middlewares/ways';
import {
  linksAddPermission,
  linksCreate,
  linksCreateBatch,
  linksAddPermissionBatch,
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
    milestone_id: string,
  }),
  mapLocals(locals => ({
    text: locals.note_content,
  })),
  notesCreate,
  // Some mapping so we can add the note as an attachment to the goal
  mapLocals((locals) => {
    const note = locals.notes[0];
    const options = {
      type: 'note',
      id: note.id,
      title: 'Goal description',
      account_id: locals.user_id,
    };

    return { link: getSwipesLinkObj({ ...options }) };
  }),
  linksCreate,
  linksAddPermission,
  attachmentsCreate,
  goalsCreate,
  goalsInsert,
  mapLocals(locals => ({
    target_id: locals.goal.id,
  })),
  attachmentsInsert,
  mapLocals(
    (locals) => {
      const {
        goal,
        attachment,
        attachment_order,
      } = locals;

      goal.attachments[attachment.id] = attachment;
      goal.attachment_order = attachment_order;

      return {
        goal_id: goal.id,
        goal,
      };
    },
  ),
  milestonesAddGoal,
  goalsCreateQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
    milestone_id: string,
    goal_order: array,
  }));

authed.all('/goals.complete',
  valBody({
    goal_id: string.require(),
  }),
  notificationCreateGroupId,
  goalsCompleteGoal,
  goalsCompleteQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

authed.all('/goals.incomplete',
  valBody({
    goal_id: string.require(),
  }),
  notificationCreateGroupId,
  goalsIncompleteGoal,
  goalsIncompleteQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

authed.all('/goals.completeStep',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
  }),
  notificationCreateGroupId,
  goalsCompleteStep,
  goalsCompleteStepQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

authed.all('/goals.incompleteStep',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
  }),
  notificationCreateGroupId,
  goalsIncompleteStep,
  goalsIncompleteStepQueueMessage,
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
  mapLocals(locals => ({
    goal_ids: [locals.goal_id],
  })),
  notificationCreateGroupId,
  goalsArchive,
  milestonesRemoveGoal,
  goalsArchiveQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    milestone_id: string,
    goal_order: array,
  }));

authed.all('/goals.notify',
  valBody({
    goal_id: string.require(),
    assignees: array.of(string).min(1).require(),
    message: string.min(1).require(),
    flags: array.of(string),
    notification_type: any.of('feedback', 'update', 'assets', 'decision', 'default'),
    request: bool,
    reply_to: number,
  }),
  notificationCreateGroupId,
  goalsNotify,
  goalsHistoryUpdateIfReply,
  goalsNotifyQueueMessage,
  notificationsPushToQueue,
  goalsNotifyEmailQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

authed.all('/goals.loadWay',
  valBody({
    goal_id: string.require(),
    way_id: string.require(),
  }),
  waysGetSingle,
  waysModifyStepsAndAttachmentsInWay,
  waysGetNoteContentFromWayAttachmets,
  mapLocals(locals => ({
    organization_id: locals.way.organization_id,
    text: locals.texts,
  })),
  notesCreate,
  mapLocals((locals) => {
    const notes = locals.notes;
    const notesAttachment = locals.notesAttachment;
    const links = [];

    notes.forEach((note, i) => {
      const options = {
        type: 'note',
        id: note.id,
        title: notesAttachment[i].title,
        account_id: locals.user_id,
      };

      links.push(getSwipesLinkObj({ ...options }));
    });

    return { links };
  }),
  linksCreateBatch,
  linksAddPermissionBatch,
  mapLocals((locals) => {
    const short_urls = locals.short_urls;
    const links = locals.links.map((link, i) => {
      return Object.assign({}, link, {
        short_url: short_urls[i],
      });
    });

    return { links };
  }),
  waysModifyNotesContentInWayAttachments,
  goalsAppendWayToGoal,
  goalsAppendWayToGoalQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }));

export {
  authed,
  notAuthed,
};
