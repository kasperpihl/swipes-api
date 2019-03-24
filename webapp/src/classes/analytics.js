import mixpanel from 'mixpanel-browser';
const blockedMixpanelEvents = [];

export default class Analytics {
  constructor(store) {
    this.enable = !store.getState().global.get('isDev');
    // this.enable = true; // for testing on dev. turn off when done.
    if (this.enable) {
      // amplitude.getInstance().init("fea8942630d7141403673df1c646ecc7");
      mixpanel.init('a1b6f31fc988c7e4a7f40c267e315f5d');
    }
    this.store = store;
    this.userId = null;
    store.subscribe(this.storeChange);
  }
  getDefaultEventProps() {
    const { global } = this.store.getState();
    const isElectron = global.get('isElectron');
    const version = global.get('version');
    const platform = global.get('platform');
    const electronVersion = global.get('sw-electron-version');
    const defs = {
      _Client: isElectron ? 'Electron' : 'Web',
      '_Web version': version,
      _Platform: platform
    };
    if (electronVersion) {
      defs['_Electron version'] = electronVersion;
    }
    return defs;
  }
  logout() {
    if (this.enable) {
      mixpanel.reset();
    }
  }
  sendEvent = (name, data) => {
    const defs = this.getDefaultEventProps();
    if (this.enable) {
      const props = Object.assign(defs, data);
      if (blockedMixpanelEvents.indexOf(name) === -1) {
        mixpanel.track(name, props);
      } else {
        console.log('blocked mixpanel event', name);
      }
    }
  };
  storeChange = () => {
    const { me } = this.store.getState();

    if (me && me.get('id') && me.get('id') !== this.userId) {
      this.userId = me.get('id');
      if (this.enable) {
        mixpanel.identify(this.userId);
      }
    }
  };
}
