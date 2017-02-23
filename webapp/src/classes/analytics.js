/* global amplitude */
import { bindAll } from 'classes/utils';

export default class Analytics {
  constructor(store) {
    amplitude.getInstance().init('862d696479638f16c727cf7dcbcd67d5');

    this.store = store;
    this.userId = null;
    bindAll(this, ['storeChange']);
    store.subscribe(this.storeChange);
  }
  getDefaultEventProps() {
    const defs = {
      _Client: window.ipcListener.isElectron ? 'Electron' : 'Web',
      '_Web version': window.__VERSION__,
      _Platform: window.ipcListener.platform,
    };
    if (window.ipcListener.version) {
      defs['_Electron version'] = window.ipcListener.version;
    }
    return defs;
  }
  logout() {
    amplitude.getInstance().setUserId(null);
    amplitude.getInstance().regenerateDeviceId();
  }
  sendEvent(name, data) {
    const defs = this.getDefaultEventProps();

    amplitude.getInstance().logEvent(name, Object.assign(defs, data));
  }
  storeChange() {
    const state = this.store.getState();

    const me = state.get('me');
    if (me && me.get('id') !== this.userId) {
      const orgId = me.getIn(['organizations', 0, 'id']);
      const orgName = me.getIn(['organizations', 0, 'name']);
      this.userId = me.get('id');
      amplitude.getInstance().setUserId(me.get('id'));
      amplitude.getInstance().setUserProperties({
        'First name': me.get('first_name'),
        'Last name': me.get('last_name'),
        Email: me.get('email'),
        'Number of services': me.get('services').size,
        'Company id': orgId,
        'Company name': orgName,
        'Company size': state.get('users').size,
        'Services connected': me.get('services').map(s => s.get('service_name')).toArray(),
      });
    }
  }

}
