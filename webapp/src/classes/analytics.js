/* global amplitude, Intercom */
import { bindAll } from 'swipes-core-js/classes/utils';

export default class Analytics {
  constructor(store) {
    amplitude.getInstance().init('862d696479638f16c727cf7dcbcd67d5');
    Intercom("boot", {
      app_id: "q8xibmac",
    });
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
    Intercom('shutdown');
    amplitude.getInstance().setUserId(null);
    amplitude.getInstance().regenerateDeviceId();
  }
  sendEvent(name, data) {
    const defs = this.getDefaultEventProps();
    Intercom("trackEvent", name, Object.assign(defs, data));
    amplitude.getInstance().logEvent(name, Object.assign(defs, data));
  }
  storeChange() {
    const state = this.store.getState();
    const me = state.get('me');

    if (me && me.get('id') && me.get('id') !== this.userId) {

      const org = me.getIn(['organizations', 0]);
      const orgId = me.getIn(['organizations', 0, 'id']);
      const orgName = me.getIn(['organizations', 0, 'name']);
      this.userId = me.get('id');
      Intercom('update', {
        name: msgGen.users.getFullName('me'),
        email: me.get('email'),
        created_at: me.get('created_at'),
        company: {
          id: orgId,
          name: orgName,
          created_at: org.get('created_at'),
        }
      });
      amplitude.getInstance().setUserId(me.get('id'));
      amplitude.getInstance().setUserProperties({
        'First name': msgGen.users.getFirstName(me),
        'Last name': msgGen.users.getLastName(me),
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
