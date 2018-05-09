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
import * as posts from './posts';

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
  goals.goalsGeneralNotificationData,
  notify.notifyAllInCompany,
]);

const goal_incompleted = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralNotificationData,
  notify.notifyAllInCompany,
]);

const goal_archived = notifyWrapper([
  goals.goalsArchiveNotificationData,
  notify.notifyAllInCompany,
]);

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

    res.locals.user_ids = organization.active_users.filter(userId => userId !== user.id);

    return next();
  },
  users.usersGetMultipleWithFields,
  emails.usersAcceptedInvitationEmail,
]);

const user_invited = [
  users.usersInvitedNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
];

const user_signup = [
  // organizations.organizationsGetSingle,
  emails.usersWelcomeEmail,
  // users.usersSubscribeToMailChimp,
];

const user_confirm = [
  users.confirmEmailNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
];

const user_organization_left = [
  users.organizationDisabledLeftNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
];

const user_disabled = [
  users.organizationDisabledLeftNotificationData,
  notify.notifySingleUser,
  notify.notifyCommonRethinkdb,
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
  goals.goalsGeneralNotificationData,
  notify.notifyAllInGoal,
  notify.notifySendEventToAllInCompany,
]);

const step_incompleted = notifyWrapper([
  goals.goalsGetSingle,
  goals.goalsGeneralNotificationData,
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

const milestone_opened = notifyWrapper([
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

const milestone_goals_reordered = notifyWrapper([
  milestones.milestonesGoalsReorderedNotificationData,
  notify.notifyAllInCompany,
]);

const milestone_deleted = notifyWrapper([
  milestones.milestonesDeletedNotificationData,
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

const goal_assigned = notifyWrapper([
  users.usersGetSingleWithFields,
  (req, res, next) => {
    const {
      userWithFields,
    } = res.locals;

    res.locals.organization_id = userWithFields.organizations[0];

    return next();
  },
  goals.goalsGetSingle,
  goals.goalsAssignedNotificationData,
  goals.goalsAssignedUsersNotificationDataMap,
  (req, res, next) => {
    const {
      user_id,
      assignees_diff,
    } = res.locals;

    res.locals.user_ids = assignees_diff.filter((userId) => { return userId !== user_id; });

    return next();
  },
  notify.notifyMultipleUsers,
  notify.notifySendEventToAllInCompany,
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

const organization_updated = notifyWrapper([
  organizations.organizationsCreatedUpdatedNotificationData,
  notify.notifyAllInCompany,
]);

const organization_created = notifyWrapper([
  organizations.organizationsCreatedUpdatedNotificationData,
  notify.notifyAllInCompany,
]);

const organization_user_invited = notifyWrapper([
  organizations.organizationsUsersInvitedNotificationData,
  notify.notifyAllInCompany,
]);

const organization_user_joined = notifyWrapper([
  users.usersGetSingleWithFields,
  (req, res, next) => {
    const {
      userWithFields,
    } = res.locals;

    res.locals.organization_id = userWithFields.organizations[0];

    return next();
  },
  organizations.organizationsUserJoinedNotificationData,
  notify.notifyAllInCompany,
]);

const organization_deleted = [
  organizations.organizationsDeletedNotificationData,
  (req, res, next) => {
    const {
      users_to_notify,
    } = res.locals;

    res.locals.user_ids = users_to_notify;

    return next();
  },
  notify.notifyMultipleUsers,
  notify.notifyCommonRethinkdb,
];

const organization_milestone_reordered = notifyWrapper([
  users.usersGetSingleWithFields,
  (req, res, next) => {
    const {
      userWithFields,
    } = res.locals;

    res.locals.organization_id = userWithFields.organizations[0];

    return next();
  },
  organizations.organizationsMilestoneReorderNotificationData,
  notify.notifyAllInCompany,
]);

const post_created = notifyWrapper([
  users.usersGetSingleWithFields,
  (req, res, next) => {
    const {
      userWithFields,
    } = res.locals;

    res.locals.organization_id = userWithFields.organizations[0];

    return next();
  },
  posts.postsGetSingle,
  posts.postCreatedNotificationData,
  (req, res, next) => {
    const {
      post,
    } = res.locals;

    res.locals.user_ids = post.tagged_users;

    return next();
  },
  notify.notifyMultipleUsers,
  notify.notifySendEventToAllInCompany,
]);
const post_created_push_notification = [
  users.usersGetSingleWithOrganizations,
  posts.postsGetSingle,
  posts.postCreatedPushNotificationData,
  (req, res, next) => {
    const {
      post,
    } = res.locals;

    res.locals.user_ids = post.tagged_users;

    return next();
  },
  notify.notifySendPushNotification,
];
const post_comment_followers_push_notification = [
  users.usersGetSingleWithOrganizations,
  posts.postsGetSingle,
  posts.postAddCommentFollowersPushNotificationData,
  (req, res, next) => {
    const {
      user_id,
      mention_ids,
      post,
    } = res.locals;

    res.locals.user_ids = post.followers.filter((follower_id) => {
      return follower_id !== user_id && !mention_ids.includes(follower_id);
    });

    return next();
  },
  notify.notifySendPushNotification,
];
const post_comment_mention_push_notification = [
  users.usersGetSingleWithOrganizations,
  posts.postsGetSingle,
  posts.postAddCommentMentionPushNotificationData,
  (req, res, next) => {
    const {
      user_id,
      mention_ids,
    } = res.locals;

    res.locals.user_ids = mention_ids.filter(userId => userId !== user_id);

    return next();
  },
  notify.notifySendPushNotification,
];
const post_edited = notifyWrapper([
  users.usersGetSingleWithFields,
  (req, res, next) => {
    const {
      userWithFields,
    } = res.locals;

    res.locals.organization_id = userWithFields.organizations[0];

    return next();
  },
  posts.postsGetSingle,
  posts.postEditedNotificationData,
  (req, res, next) => {
    const {
      user_id,
      tagged_users_diff,
    } = res.locals;

    res.locals.user_ids = tagged_users_diff.filter((userId) => { return userId !== user_id; });

    return next();
  },
  notify.notifyMultipleUsers,
  notify.notifySendEventToAllInCompany,
]);
const post_edited_push_notification = [
  users.usersGetSingleWithOrganizations,
  posts.postsGetSingle,
  posts.postEditedPushNotificationData,
  (req, res, next) => {
    const {
      user_id,
      tagged_users_diff,
    } = res.locals;

    res.locals.user_ids = tagged_users_diff.filter((userId) => { return userId !== user_id; });

    return next();
  },
  notify.notifySendPushNotification,
];
const post_archived = notifyWrapper([
  posts.postArchivedNotificationData,
  notify.notifySendEventToAllInCompany,
]);

const post_comment_added = notifyWrapper([
  users.usersGetSingleWithFields,
  (req, res, next) => {
    const {
      userWithFields,
    } = res.locals;

    res.locals.organization_id = userWithFields.organizations[0];

    return next();
  },
  posts.postsGetSingle,
  posts.postCommentAddedNotificationData,
  (req, res, next) => {
    const {
      user_id,
      post,
    } = res.locals;


    res.locals.user_ids = post.followers.filter(userId => userId !== user_id);

    return next();
  },
  notify.notifyMultipleUsers,
  notify.notifySendEventToAllInCompany,
]);
const post_comment_archived = notifyWrapper([
  users.usersGetSingleWithFields,
  posts.postCommentArchivedNotificationData,
  notify.notifySendEventToAllInCompany,
]);

const post_reaction_added = notifyWrapper([
  users.usersGetSingleWithFields,
  (req, res, next) => {
    const {
      userWithFields,
    } = res.locals;

    res.locals.organization_id = userWithFields.organizations[0];

    return next();
  },
  posts.postsGetSingle,
  posts.postReactionAddedNotificationData,
  (req, res, next) => {
    const {
      user_id,
      post,
    } = res.locals;
    const {
      created_by,
    } = post;

    res.locals.user_ids = post.followers.filter((userId) => {
      return created_by === userId && userId !== user_id;
    });

    return next();
  },
  notify.notifyMultipleUsers,
  notify.notifySendEventToAllInCompany,
]);
const post_reaction_removed = notifyWrapper([
  posts.postReactionRemovedNotificationData,
  notify.notifySendEventToAllInCompany,
]);

const post_comment_reaction_added = notifyWrapper([
  users.usersGetSingleWithFields,
  (req, res, next) => {
    const {
      userWithFields,
    } = res.locals;

    res.locals.organization_id = userWithFields.organizations[0];

    return next();
  },
  posts.postsGetSingleCommentFollowers,
  posts.postCommentReactionAddedNotificationData,
  (req, res, next) => {
    const {
      user_id,
      postSingleCommentFollowers,
    } = res.locals;
    const {
      comment,
      followers,
    } = postSingleCommentFollowers;

    res.locals.user_ids = followers.filter((userId) => {
      return comment.created_by === userId && userId !== user_id;
    });

    return next();
  },
  notify.notifyMultipleUsers,
  notify.notifySendEventToAllInCompany,
]);
const post_comment_reaction_removed = notifyWrapper([
  posts.postCommentReactionRemovedNotificationData,
  notify.notifySendEventToAllInCompany,
]);
const post_unfollowed = notifyWrapper([
  posts.postFollowedUnfollowedNotificationData,
  notify.notifySendEventToAllInCompany,
]);
const post_followed = notifyWrapper([
  posts.postFollowedUnfollowedNotificationData,
  notify.notifySendEventToAllInCompany,
]);

export {
  goal_created,
  goal_completed,
  goal_incompleted,
  goal_archived,
  goal_renamed,
  goal_loaded_way,
  goal_assigned,
  step_completed,
  step_incompleted,
  milestone_created,
  milestone_closed,
  milestone_opened,
  milestone_goal_added,
  milestone_goal_removed,
  milestone_renamed,
  milestone_goals_reordered,
  milestone_deleted,
  way_created,
  way_archived,
  notifications_seen,
  attachment_added,
  attachment_renamed,
  attachment_deleted,
  attachment_reordered,
  step_added,
  step_renamed,
  step_deleted,
  step_reordered,
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
  user_organization_left,
  user_disabled,
  user_confirm,
  profile_updated,
  organization_updated,
  organization_created,
  organization_user_invited,
  organization_user_joined,
  organization_deleted,
  organization_milestone_reordered,
  post_created,
  post_edited,
  post_comment_added,
  post_comment_archived,
  post_reaction_added,
  post_reaction_removed,
  post_comment_reaction_added,
  post_comment_reaction_removed,
  post_archived,
  post_unfollowed,
  post_followed,
  post_created_push_notification,
  post_edited_push_notification,
  post_comment_followers_push_notification,
  post_comment_mention_push_notification,
};
