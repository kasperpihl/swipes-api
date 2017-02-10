import * as goals from './goals';
import * as milestones from './milestones';
import * as ways from './ways';
import * as users from './users';
import * as notifications from './notifications';
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

const goal_archived = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsArchivedNotificationData,
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

const goal_notify = notifyWrapper([
  goals.goalsNotifyNotificationData,
  notify.notifyMultipleUsers,
]);

const step_completed = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsStepCompletedNotificationData,
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
  milestones.milestonesArchivedNotificationData,
  notify.notifyAllInCompany,
]);

const way_created = notifyWrapper([
  ways.waysGetSingle,
  ways.waysCreatedNotificationData,
  notify.notifyAllInCompany,
]);

const way_archived = notifyWrapper([
  ways.waysGetSingle,
  ways.waysArchivedNotificationData,
  notify.notifyAllInCompany,
]);

const notifications_seen = [
  notifications.notificationsSeenNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
];

export {
  goal_created,
  goal_archived,
  goal_milestone_added,
  goal_milestone_removed,
  goal_notify,
  step_completed,
  step_got_active,
  milestone_created,
  milestone_archived,
  way_created,
  way_archived,
  notifications_seen,
};
