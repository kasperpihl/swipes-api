import * as goals from './goals';
import * as steps from './steps';
import * as attachments from './attachments';
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
  notify.notifyAllInCompany,
]);

const goal_completed = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  goals.goalsStepsInterseptUsers,
  goals.goalsHistoryInterseptUsers,
  notify.notifyAllInCompany,
]);

const goal_started = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  goals.goalsStepsInterseptUsers,
  goals.goalsHistoryInterseptUsers,
  notify.notifyAllInCompany,
]);

const goal_archived = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  goals.goalsStepsInterseptUsers,
  goals.goalsHistoryInterseptUsers,
  notify.notifyAllInCompany,
]);

const goal_milestone_added = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  notify.notifyAllInCompany,
]);

const goal_milestone_removed = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  notify.notifyAllInCompany,
]);

const goal_notify = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  goals.goalsNotifyAddSenderAlways,
  notify.notifyMultipleUsers,
  notify.notifySendEventToAllInCompany,
]);

const goal_renamed = notifyWrapper([
  goals.goalsRenamedNotificationData,
  notify.notifyAllInCompany,
]);

const goal_loaded_way = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsLoadedWayNotificationData,
  notify.notifyAllInCompany,
]);

const step_completed = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  goals.goalsNextStepInterseptUsers,
  notify.notifyAllInGoal,
  notify.notifySendEventToAllInCompany,
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

const notifications_seen_ids_history_updated = [
  notifications.notificationsGetIds,
  notifications.noticationsUpdateTargetHistory,
  notify.notifyManyToMany,
];

const notifications_seen_ids = [
  notifications.notificationsSeenIdsNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
];

const attachment_added = notifyWrapper([
  attachments.attachmentsAddedNotificationData,
  notify.notifyAllInCompany,
]);

const attachment_renamed = notifyWrapper([
  attachments.attachmentsRenamedNotificationData,
  notify.notifyAllInCompany,
]);

const attachment_deleted = notifyWrapper([
  attachments.attachmentsDeletedNotificationData,
  notify.notifyAllInCompany,
]);

const attachment_reordered = notifyWrapper([
  attachments.attachmentsReorderedNotificationData,
  notify.notifyAllInCompany,
]);

const step_added = notifyWrapper([
  steps.stepsAddedNotificationData,
  notify.notifyAllInCompany,
]);

const step_renamed = notifyWrapper([
  steps.stepsRenamedNotificationData,
  notify.notifyAllInCompany,
]);

const step_deleted = notifyWrapper([
  steps.stepsDeletedNotificationData,
  notify.notifyAllInCompany,
]);

const step_reordered = notifyWrapper([
  steps.stepsReorderedNotificationData,
  notify.notifyAllInCompany,
]);

const step_assigned = notifyWrapper([
  steps.stepsAssignedNotificationData,
  notify.notifyAllInCompany,
]);

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
  goal_started,
  goal_archived,
  goal_milestone_added,
  goal_milestone_removed,
  goal_notify,
  goal_renamed,
  goal_loaded_way,
  step_completed,
  milestone_created,
  milestone_archived,
  way_created,
  way_archived,
  notifications_seen_ids_history_updated,
  notifications_seen_ids,
  attachment_added,
  attachment_renamed,
  attachment_deleted,
  attachment_reordered,
  step_added,
  step_renamed,
  step_deleted,
  step_reordered,
  step_assigned,
  xendo_user_signup,
  xendo_remove_service_from_user,
  xendo_add_service_to_user,
  token_revoked,
};
