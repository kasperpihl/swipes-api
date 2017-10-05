/* global Intercom */
import mixpanel from 'mixpanel-browser';
import { bindAll } from 'swipes-core-js/classes/utils';
const blockedMixpanelEvents = [

];

export default class Analytics {
  constructor(store) {
    this.enable = !store.getState().getIn(['globals', 'isDev']);
    // this.enable = true; // for testing on dev. turn off when done.
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
    const state = this.store.getState();
    const isElectron = state.getIn(['globals', 'isElectron']);
    const version = state.getIn(['globals', 'version']);
    const platform = state.getIn(['globals', 'platform']);
    const electronVersion = state.getIn(['globals', 'sw-electron-version']);
    const defs = {
      _Client: isElectron ? 'Electron' : 'Web',
      '_Web version': version,
      _Platform: platform,
    };
    if (electronVersion) {
      defs['_Electron version'] = electronVersion;
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

      this.userId = me.get('id');
      if(this.enable){
        const intercomObj = {
          name: msgGen.users.getFullName(me),
          'Is admin': msgGen.me.isAdmin(),
          'Is paying': msgGen.me.isPaying(),
          user_id: me.get('id'),
          email: msgGen.users.getEmail(me),
          created_at: me.get('created_at'),
        };
        const org = me.getIn(['organizations', 0]);
      
        if(org) {
          intercomObj.company = {
            id: org.get('id'),
            name: org.get('name'),
            created_at: org.get('created_at'),
          }
        }
        Intercom('update', intercomObj);
        mixpanel.identify(this.userId);
      }
    }
  }

}
