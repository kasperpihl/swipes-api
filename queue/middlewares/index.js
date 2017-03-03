import * as goals from './goals';
import * as milestones from './milestones';
import * as ways from './ways';
import * as users from './users';
import * as xendo from './xendo';
import * as tokens from './tokens';
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
const xendoWrapper = (middlewares) => {
  return [
    xendo.xendoSwipesCredentials,
    xendo.xendoRefreshSwipesToken,
  ]
  .concat(middlewares);
};
const goal_created = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsCreatedNotificationData,
  goals.goalsStepsInterseptUsers,
  notify.notifyAllInCompany,
]);

const goal_completed = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsCompletedNotificationData,
  goals.goalsStepsInterseptUsers,
  goals.goalsHistoryInterseptUsers,
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
  goals.goalsGetSingle,
  goals.goalsNotifyNotificationData,
  notify.notifyMultipleUsers,
  goals.goalsNotifyDoneBy,
]);

const step_completed = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsStepCompletedNotificationData,
  goals.goalsNextStepInterseptUsers,
  notify.notifyAllInGoal,
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

const notifications_seen_ts = [
  notifications.notificationsSeenTsNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
];

const notifications_seen_ids = [
  notifications.notificationsSeenIdsNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
];

const xendo_user_signup = xendoWrapper([
  xendo.xendoUserSignUp,
]);

const xendo_remove_service_from_user = xendoWrapper([
  xendo.xendoRemoveServiceFromUser,
]);

const xendo_add_service_to_user = xendoWrapper([
  xendo.xendoAddServiceToUser,
]);

const token_revoked = [
  tokens.tokensRevokedNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
];

export {
  goal_created,
  goal_completed,
  goal_archived,
  goal_milestone_added,
  goal_milestone_removed,
  goal_notify,
  step_completed,
  milestone_created,
  milestone_archived,
  way_created,
  way_archived,
  notifications_seen_ts,
  notifications_seen_ids,
  xendo_user_signup,
  xendo_remove_service_from_user,
  xendo_add_service_to_user,
  token_revoked,
};
