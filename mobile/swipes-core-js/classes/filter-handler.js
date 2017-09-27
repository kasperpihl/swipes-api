import { Map, List } from 'immutable';
import * as types from '../constants';
import { bindAll } from './utils';

export default class FilterHandler {
  constructor(store) {
    this.store = store;
    bindAll(this, ['storeChange']);
    store.subscribe(this.storeChange);
  }
  storeChange() {
    const state = this.store.getState();
    this.myId = state.getIn(['me', 'id']);

    const notifications = state.get('notifications');
    const lastReadTs = state.getIn(['me', 'settings', 'last_read_ts']);
    if (notifications !== this.prevNotifications || lastReadTs !== this.prevLastReadTs) {
      this.prevNotifications = this.prevNotifications || List();
      let counter = 0;

      notifications.forEach((n, i) => {
        if (!n.get('seen_at') && (!lastReadTs || lastReadTs < n.get('created_at'))) {
          counter += 1;
        }
      });
      const currUnread = state.getIn(['connection', 'notificationCounter']);

      this.prevNotifications = notifications;
      this.prevLastReadTs = lastReadTs;
      if (currUnread !== counter) {
        this.store.dispatch({ type: types.UPDATE_NOTIFICATION_COUNTER, payload: { counter } });
        if (window.ipcListener) {
          window.ipcListener.setBadgeCount(`${counter || ''}`);
        }
      }
    }
  }
}
