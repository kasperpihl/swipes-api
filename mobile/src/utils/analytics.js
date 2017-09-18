/* global amplitude, Intercom */
import mixpanel from 'react-native-mixpanel';
import Intercom from 'react-native-intercom';
import { bindAll } from 'swipes-core-js/classes/utils';
import DeviceInfo from 'react-native-device-info';
const blockedMixpanelEvents = [

];

export default class Analytics {
  constructor(store) {
    this.enable = !window.__DEV__;
    // this.enable = true; // for testing on dev. turn off when done.
    if(this.enable){
      mixpanel.sharedInstanceWithToken("a1b6f31fc988c7e4a7f40c267e315f5d");
      /*Intercom("boot", {
        app_id: "q8xibmac",
      });*/
    }
    this.store = store;
    this.userId = null;
    bindAll(this, ['storeChange', 'sendEvent']);
    store.subscribe(this.storeChange);

  }
  getDefaultEventProps() {
    const defs = {
      _Client: 'ReactNative',
      '_Version': window.__VERSION__,
      _Platform: window.__PLATFORM__,
      '_App version': DeviceInfo.getVersion(),
    };
    return defs;
  }
  logout() {
    if(this.enable){
      Intercom.reset();
      mixpanel.reset();
    }
  }
  sendEvent(name, data) {
    const defs = this.getDefaultEventProps();
    if(this.enable){
      const props = Object.assign(defs, data);
      Intercom.logEvent(name, props);
      if(blockedMixpanelEvents.indexOf(name) === -1){
        mixpanel.trackWithProperties(name, props);
      } else {
        // console.log('blocked mixpanel event', name);
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
        Intercom.registerIdentifiedUser({ email: msgGen.users.getEmail(me) });
        Intercom.updateUser({
          name: msgGen.users.getFullName(me),
          'Is admin': msgGen.me.isAdmin(),
          'Is paying': msgGen.me.isPaying(),
          email: msgGen.users.getEmail(me),
          user_id: me.get('id'),
          created_at: me.get('created_at'),
          company: {
            id: orgId,
            name: orgName,
            created_at: org.get('created_at'),
          }
        });
        mixpanel.identify(me.get('id'));
      }
    }
  }

}
