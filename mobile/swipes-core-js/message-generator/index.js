import GoalsGenerator from './goals-generator';
import HistoryGenerator from './history-generator';
import MilestonesGenerator from './milestones-generator';
import OrganizationsGenerator from './organizations-generator';
import NotificationsGenerator from './notifications-generator';
import NotifyGenerator from './notify-generator';
import UsersGenerator from './users-generator';

export default class MessageGenerator {
  constructor(store) {
    this.store = store;
    this.goals = new GoalsGenerator(store, this);
    this.history = new HistoryGenerator(store, this);
    this.milestones = new MilestonesGenerator(store, this);
    this.notifications = new NotificationsGenerator(store, this);
    this.notify = new NotifyGenerator(store, this);
    this.orgs = new OrganizationsGenerator(store, this);
    this.users = new UsersGenerator(store, this);
  }
}
