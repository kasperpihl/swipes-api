import * as goals from './goals';
import * as users from './users';
import * as notify from './notify';

const goal_created = [
  users.usersGetSingleWithOrganizations,
  goals.goalsGetSingle,
  goals.goalsNotificationData,
  notify.notifyAllInCompany,
  notify.notifyInsertMultipleNotifications,
  notify.notifyCommonRethinkdb,
];

const goal_deleted = [
  users.usersGetSingleWithOrganizations,
  goals.goalsGetSingle,
  goals.goalsDeletedNotificationData,
  notify.notifyAllInCompany,
  notify.notifyInsertMultipleNotifications,
  notify.notifyCommonRethinkdb,
];

const step_completed = [
  users.usersGetSingleWithOrganizations,
  goals.goalsGetSingle,
  goals.goalsStepGotActiveNotificationData,
  notify.notifyAllInCompany,
  notify.notifyInsertMultipleNotifications,
  notify.notifyCommonRethinkdb,
];

const step_got_active = [
  users.usersGetSingleWithOrganizations,
  goals.goalsGetSingle,
  goals.goalsStepGotActiveNotificationData,
  notify.notifyAllInCurrentStep,
  notify.notifyInsertMultipleNotifications,
  notify.notifyCommonRethinkdb,
];

export {
  goal_created,
  goal_deleted,
  step_completed,
  step_got_active,
};
