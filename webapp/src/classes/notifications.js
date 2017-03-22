import * as a from 'actions';

class Notifications {
  constructor(store) {
    this.store = store;
    store.subscribe(this.storeChange.bind(this));
  }
  storeChange() {
    const state = this.store.getState();
    const notifications = state.getIn(['notifications']);

    if (notifications !== this.prevNotifications && this.isHydrated) {
      this.prevNotifications = notifications;
      let counter = notifications.filter(n => n && n.get('receiver') && n.get('important') && !n.get('seen_at')).size;
      if (!counter) {
        counter = '';
      }
      this.store.dispatch(a.navigation.setCounter('Dashboard', counter));
    }
    this.isHydrated = state.getIn(['main', 'isHydrated']);
  }
}
export default Notifications;
