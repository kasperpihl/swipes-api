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
import * as emails from './emails';
import * as me from './me';
import * as organizations from './organizations';

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
const noUserNotifyWrapper = (middlewares) => {
  middlewares
  .concat([
    notify.notifyInsertMultipleNotifications,
    notify.notifyCommonRethinkdb,
  ]);
};
const goal_created = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsCreatedNotificationData,
  notify.notifyAllInCompany,
]);

const goal_completed = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  notify.notifyAllInCompany,
]);

const goal_incompleted = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  notify.notifyAllInCompany,
]);

const goal_archived = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsArchiveWithHistoryNotificationData,
  notify.notifyAllInCompany,
]);

const goal_notify = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  goals.goalsNotifyAdditionalData,
  goals.goalsNotifyAddSenderAlways,
  notify.notifyMultipleUsers,
  notify.notifySendEventToAllInCompany,
  notify.notifyGoalNotifySendPushNotifications,
]);

const goal_notify_email = [
  users.usersGetSingleWithOrganizations,
  goals.goalsGetSingle,
  users.usersGetMultipleWithFields,
  emails.goalsNotifySendEmails,
];

const user_invitation_email = [
  (req, res, next) => {
    const {
      inviter_user_id,
    } = res.locals;

    res.locals.user_ids = [inviter_user_id];
    res.locals.fields = ['profile'];

    return next();
  },
  users.usersGetMultipleWithFields,
  organizations.organizationsGetSingle,
  emails.usersInvitationEmail,
];

const send_reset_password_email = [
  emails.meResetPasswordEmail,
];

const user_activated = notifyWrapper([
  users.usersActivatedNotificationData,
  notify.notifyAllInCompany,
  (req, res, next) => {
    const {
      user,
    } = res.locals;
    const organization = user.organizations[0];

    res.locals.user_ids = organization.users.filter(userId => userId !== user.id);

    return next();
  },
  users.usersGetMultipleWithFields,
  emails.usersAcceptedInvitationEmail,
]);

const user_invited = notifyWrapper([
  users.usersInvitedNotificationData,
  notify.notifyAllInCompany,
]);

const user_signup = [
  organizations.organizationsGetSingle,
  emails.usersWelcomeEmail,
  users.usersSubscribeToMailChimp,
];

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
  notify.notifyAllInGoal,
  notify.notifySendEventToAllInCompany,
]);

const step_incompleted = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralWithHistoryNotificationData,
  notify.notifyAllInGoal,
  notify.notifySendEventToAllInCompany,
]);

const milestone_created = notifyWrapper([
  milestones.milestonesGetSingle,
  milestones.milestonesGeneralWithHistoryNotificationData,
  notify.notifyAllInCompany,
]);

const milestone_closed = notifyWrapper([
  milestones.milestonesGetSingle,
  milestones.milestoneOpenCloseWithHistoryNotificationData,
  notify.notifyAllInCompany,
]);

const milestones_opened = notifyWrapper([
  milestones.milestonesGetSingle,
  milestones.milestoneOpenCloseWithHistoryNotificationData,
  notify.notifyAllInCompany,
]);

const milestone_goal_added = notifyWrapper([
  milestones.milestonesGoalAddedRemovedNotificationData,
  notify.notifyAllInCompany,
]);

const milestone_goal_removed = notifyWrapper([
  milestones.milestonesGoalAddedRemovedNotificationData,
  notify.notifyAllInCompany,
]);

const milestone_renamed = notifyWrapper([
  milestones.milestonesRenamedNotificationData,
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

const notifications_seen_history_updated = [
  notifications.notificationsGetIds,
  notifications.noticationsUpdateTargetHistory,
  notify.notifyManyToMany,
];

const notifications_seen = [
  notifications.notificationsSeenNotificationData,
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

const settings_updated = [
  me.meSettingsUpdatedNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
];

const profile_updated = notifyWrapper([
  me.meProfileUpdatedNotificationData,
  notify.notifyAllInCompany,
]);

const organization_updated = noUserNotifyWrapper([
  organizations.organizationsGetSingle,
  organizations.organizationsUpdatedNotificationData,
]);

export {
  goal_created,
  goal_completed,
  goal_incompleted,
  goal_archived,
  goal_notify,
  goal_notify_email,
  goal_renamed,
  goal_loaded_way,
  step_completed,
  step_incompleted,
  milestone_created,
  milestone_closed,
  milestones_opened,
  milestone_goal_added,
  milestone_goal_removed,
  milestone_renamed,
  way_created,
  way_archived,
  notifications_seen_history_updated,
  notifications_seen,
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
  settings_updated,
  user_invitation_email,
  send_reset_password_email,
  user_activated,
  user_invited,
  user_signup,
  profile_updated,
  organization_updated,
};
