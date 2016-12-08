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

export {
  goal_created,
};
