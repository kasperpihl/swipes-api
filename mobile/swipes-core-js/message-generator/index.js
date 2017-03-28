import Goals from './goals-generator';
import Users from './users-generator';
import Milestones from './milestones-generator';
import Notifications from './notifications-generator';
import Notify from './notify-generator';

export default class MessageGenerator {
  constructor(store) {
    this.store = store;
    this.goals = new Goals(store, this);
    this.notifications = new Notifications(store, this);
    this.users = new Users(store, this);
    this.milestones = new Milestones(store, this);
  }
}
