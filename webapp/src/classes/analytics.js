/* global Intercom */
import mixpanel from 'mixpanel-browser';
import { bindAll } from 'swipes-core-js/classes/utils';
const blockedMixpanelEvents = [

];

export default class Analytics {
  constructor(store) {
    this.enable = !window.__DEV__;
    this.enable = true; // for testing on dev. turn off when done.
    if(this.enable){
      mixpanel.init("a1b6f31fc988c7e4a7f40c267e315f5d");
      Intercom("boot", {
        app_id: "q8xibmac",
      });
    }
    this.store = store;
    this.userId = null;
    bindAll(this, ['storeChange', 'sendEvent']);
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
    if(this.enable){
      Intercom('shutdown');
      mixpanel.reset()
    }
  }
  sendEvent(name, data) {
    const defs = this.getDefaultEventProps();
    if(this.enable){
      const props = Object.assign(defs, data);
      Intercom("trackEvent", name, props);
      if(blockedMixpanelEvents.indexOf(name) === -1){
        mixpanel.track(name, props);
      } else {
        console.log('blocked mixpanel event', name);
      }

    }

  }
  storeChange() {
    const state = this.store.getState();
    const me = state.get('me');

    if (me && me.get('id') && me.get('id') !== this.userId) {

      const org = me.getIn(['organizations', 0]);
      const orgId = me.getIn(['organizations', 0, 'id']);
      const orgName = me.getIn(['organizations', 0, 'name']);
      this.userId = me.get('id');
      if(this.enable){
        Intercom('update', {
          name: msgGen.users.getFullName(me),
          'Is admin': msgGen.me.isAdmin(),
          'Is paying': msgGen.me.isPaying(),
          id: me.get('id'),
          email: msgGen.users.getEmail(me),
          created_at: me.get('created_at'),
          company: {
            id: orgId,
            name: orgName,
            created_at: org.get('created_at'),
          }
        });
        mixpanel.identify(this.userId);
      }
    }
  }

}
