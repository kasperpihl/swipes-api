import mixpanel from 'mixpanel-browser';

export default class Analytics {
  constructor(store) {
    this.enable = !!store.getState().global.get('isDev');
    // this.enable = true; // for testing on dev. turn off when done.
    if (this.enable) {
      mixpanel.init('280f53ea477a89ca86e0f7c8825528ca');
      // mixpanel.init('cdb182baa17a94f1a4ace32ad04c2322');
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
      sw_client: isElectron ? 'electron' : 'web',
      sw_version: version,
      sw_platform: platform
    };
    if (electronVersion) {
      defs['sw_electron_version'] = electronVersion;
    }
    return defs;
  }
  logout() {
    if (this.enable) {
      mixpanel.reset();
    }
  }
  sendEvent = (name, ownedBy, data) => {
    if (typeof ownedBy === 'object') {
      data = ownedBy;
      ownedBy = null;
    }
    const defs = this.getDefaultEventProps();
    if (this.enable) {
      const props = Object.assign(defs, data);
      if (typeof ownedBy === 'string' && ownedBy.startsWith('T')) {
        props.team_id = ownedBy;
      }
      console.log('tracking', name, props);
      mixpanel.track(name, props);
    }
  };
  storeChange = () => {
    const { me } = this.store.getState();

    if (me && me.get('user_id') && me.get('user_id') !== this.userId) {
      this.userId = me.get('user_id');
      if (this.enable) {
        console.log('userId', this.userId);
        mixpanel.identify(this.userId);
        mixpanel.people.set_once({
          $email: me.get('email'), // only special properties need the $
          $created: me.get('created_at'),
          $first_name: me.get('first_name'),
          $last_name: me.get('last_name')
        });
      }
    }
  };
}
