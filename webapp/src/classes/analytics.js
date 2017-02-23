/* global amplitude */
import { bindAll } from 'classes/utils';

export default class Analytics {
  constructor(store) {
    amplitude.getInstance().init('812b0fb59e42cd24454364529ae55873');

    this.store = store;
    this.userId = null;
    bindAll(this, ['storeChange']);
    store.subscribe(this.storeChange);
  }
  logout() {
    amplitude.getInstance().setUserId(null);
    amplitude.getInstance().regenerateDeviceId();
  }
  sendEvent(name, data) {
    amplitude.getInstance().logEvent(name, data);
  }
  storeChange() {
    const state = this.store.getState();

    const userId = state.getIn(['me', 'id']);
    if (userId !== this.userId) {
      this.userId = userId;
      amplitude.getInstance().setUserId(userId);
    }
  }

}
