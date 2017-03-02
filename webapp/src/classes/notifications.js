import * as a from 'actions';

class Notifications {
  constructor(store) {
    this.store = store;
    store.subscribe(this.storeChange.bind(this));
  }
  storeChange() {
    const state = this.store.getState();
    const notifications = state.getIn(['main', 'notifications']);
    if (notifications !== this.prevNotifications) {
      this.prevNotifications = notifications;
      let counter = notifications.filter(n => n && !n.get('seen')).size;
      if (!counter) {
        counter = '';
      }
      this.store.dispatch(a.navigation.setCounter('Dashboard', counter));
    }
  }
}
export default Notifications;
