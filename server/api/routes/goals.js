import express from 'express';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  milestonesRemoveGoal,
  milestonesAddGoal,
} from './middlewares/milestones';
import {
  goalsCreate,
  goalsArchive,
  goalsInsert,
  goalsCreateQueueMessage,
  goalsArchiveQueueMessage,
  goalsCompleteStep,
  goalsCompleteStepQueueMessage,
  goalsIncompleteStepQueueMessage,
  goalsRename,
  goalsRenameQueueMessage,
  goalsAppendWayToGoal,
  goalsAppendWayToGoalQueueMessage,
  goalsIncompleteStep,
  goalsCompleteGoal,
  goalsCompleteQueueMessage,
  goalsIncompleteGoal,
  goalsIncompleteQueueMessage,
  goalsAssign,
  goalsAssignQueueMessage,
  goalsMilestonesMiddlewares,
  goalsMilestonesMiddlewaresRunComposer,
} from './middlewares/goals';
import {
  stepsReorder,
  stepsReorderQueueMessage,
} from './middlewares/steps';
import {
  notificationsPushToQueue,
} from './middlewares/notifications';
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
  linksCreateBatch,
  linksAddPermissionBatch,
} from './middlewares/links';
import MiddlewareComposer from './middleware_composer';
import {
  valBody,
  mapLocals,
  valResponseAndSend,
  getSwipesLinkObj,
} from '../utils';

const authed = express.Router();
const notAuthed = express.Router();

authed.all(
  '/goals.create',
  valBody({
    goal: object.as({
      title: string.min(1).require(),
      assignees: array.of(string).require(),
    }).require(),
    organization_id: string.require(),
    milestone_id: string,
  }),
  goalsCreate,
  goalsInsert,
  mapLocals((locals) => {
    const {
      goal,
    } = locals;

    return {
      goal_id: goal.id,
    };
  }),
  milestonesAddGoal,
  goalsCreateQueueMessage,
  notificationsPushToQueue,
  goalsAssignQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
    milestone_id: string,
    goal_order: object,
  }),
);

authed.all(
  '/goals.complete',
  valBody({
    goal_id: string.require(),
  }),
  goalsCompleteGoal,
  goalsCompleteQueueMessage,
  notificationsPushToQueue,
  goalsMilestonesMiddlewares,
  goalsMilestonesMiddlewaresRunComposer,
  valResponseAndSend({
    goal: object.require(),
  }),
);

authed.all(
  '/goals.incomplete',
  valBody({
    goal_id: string.require(),
  }),
  goalsIncompleteGoal,
  goalsIncompleteQueueMessage,
  notificationsPushToQueue,
  goalsMilestonesMiddlewares,
  goalsMilestonesMiddlewaresRunComposer,
  valResponseAndSend({
    goal: object.require(),
  }),
);

authed.all(
  '/goals.completeStep',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
  }),
  goalsCompleteStep,
  goalsCompleteStepQueueMessage,
  notificationsPushToQueue,
  goalsMilestonesMiddlewares,
  (originalReq, originalRes, originalNext) => {
    const {
      milestonesMiddlewares,
      goal,
    } = originalRes.locals;
    const {
      milestone_id,
    } = goal;

    if (!milestone_id || goal.completed_at === null) {
      return originalNext();
    }

    originalRes.locals.milestone_id = milestone_id;

    const composer = new MiddlewareComposer(
      originalRes.locals,
      ...milestonesMiddlewares,
      (req, res, next) => {
        return originalNext();
      },
      (err, req, res, next) => {
        return originalNext(err);
      },
    );

    return composer.run();
  },
  valResponseAndSend({
    goal: object.require(),
  }),
);

authed.all(
  '/goals.incompleteStep',
  valBody({
    goal_id: string.require(),
    step_id: string.require(),
  }),
  goalsIncompleteStep,
  goalsIncompleteStepQueueMessage,
  notificationsPushToQueue,
  goalsMilestonesMiddlewares,
  (originalReq, originalRes, originalNext) => {
    const {
      milestonesMiddlewares,
      goal,
    } = originalRes.locals;
    const {
      milestone_id,
    } = goal;

    if (!milestone_id || goal.completed_at !== null) {
      return originalNext();
    }

    originalRes.locals.milestone_id = milestone_id;

    const composer = new MiddlewareComposer(
      originalRes.locals,
      ...milestonesMiddlewares,
      (req, res, next) => {
        return originalNext();
      },
      (err, req, res, next) => {
        return originalNext(err);
      },
    );

    return composer.run();
  },
  valResponseAndSend({
    goal: object.require(),
  }),
);

authed.all(
  '/goals.rename',
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
  }),
);

authed.all(
  '/goals.archive',
  valBody({
    goal_id: string.require(),
  }),
  mapLocals(locals => ({
    goal_ids: [locals.goal_id],
  })),
  goalsArchive,
  milestonesRemoveGoal,
  goalsArchiveQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    milestone_id: string,
    goal_order: object,
  }),
);

authed.all(
  '/goals.loadWay',
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
    const {
      notes,
      notesAttachment,
    } = locals;
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
    const {
      short_urls,
    } = locals;
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
  goalsAssignQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal: object.require(),
  }),
);

authed.all(
  '/goals.stepsReorder',
  valBody({
    goal_id: string.require(),
    step_order: array.of(string).require(),
  }),
  stepsReorder,
  stepsReorderQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    step_order: array.of(string).require(),
  }),
);

authed.all(
  '/goals.assign',
  valBody({
    goal_id: string.require(),
    assignees: array.of(string).require(),
  }),
  goalsAssign,
  goalsAssignQueueMessage,
  notificationsPushToQueue,
  valResponseAndSend({
    goal_id: string.require(),
    assignees: array.require(),
    steps: object.require(),
  }),
);

export {
  authed,
  notAuthed,
};
