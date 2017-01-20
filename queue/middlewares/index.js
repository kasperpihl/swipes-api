import * as goals from './goals';
import * as milestones from './milestones';
import * as ways from './ways';
import * as users from './users';
import * as notify from './notify';

const notifyWrapper = (middlewares) => {
  return [
    users.usersGetSingleWithOrganizations,
  ]
  .concat(middlewares)
  .concat([
    notify.notifyInsertMultipleNotifications,
    notify.notifyCommonRethinkdb,
  ]);
};
const goal_created = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsNotificationData,
  notify.notifyAllInCompany,
]);

const goal_deleted = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsDeletedNotificationData,
  notify.notifyAllInCompany,
]);

const goal_milestone_added = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsMilestoneAddedNotificationData,
  notify.notifyAllInCompany,
]);

const goal_milestone_removed = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsMilestoneRemovedNotificationData,
  notify.notifyAllInCompany,
]);

const step_completed = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsStepGotActiveNotificationData,
  notify.notifyAllInCompany,
]);

const step_got_active = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsStepGotActiveNotificationData,
  notify.notifyAllInCurrentStep,
]);

const milestone_created = notifyWrapper([
  milestones.milestonesGetSingle,
  milestones.milestonesCreatedNotificationData,
  notify.notifyAllInCompany,
]);

const milestone_archived = notifyWrapper([
  milestones.milestonesGetSingle,
  milestones.milestonesDeletedNotificationData,
  notify.notifyAllInCompany,
]);

const way_created = notifyWrapper([
  ways.waysGetSingle,
  ways.waysCreatedNotificationData,
  notify.notifyAllInCompany,
]);

const way_archived = notifyWrapper([
  ways.waysGetSingle,
  ways.waysDeletedNotificationData,
  notify.notifyAllInCompany,
]);

export {
  goal_created,
  goal_deleted,
  goal_milestone_added,
  goal_milestone_removed,
  step_completed,
  step_got_active,
  milestone_created,
  milestone_archived,
  way_created,
  way_archived,
};
