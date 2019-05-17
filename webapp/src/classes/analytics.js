import mixpanel from 'mixpanel-browser';
import { mixpanelToken } from 'src/utils/configKeys';

export default class Analytics {
  constructor(store) {
    this.enable = store.getState().global.get('isDev');
    // this.enable = true; // for testing on dev. turn off when done.
    if (this.enable) {
      mixpanel.init(mixpanelToken);
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
      props['Team ID'] = 'Personal';
      if (typeof ownedBy === 'string' && ownedBy.startsWith('T')) {
        props['Team ID'] = ownedBy;
      }
      mixpanel.track(name, props);
    }
  };
  storeChange = () => {
    const { me, teams } = this.store.getState();

    if (me && me.get('user_id') && me.get('user_id') !== this.userId) {
      this.userId = me.get('user_id');
      if (this.enable) {
        mixpanel.identify(this.userId);
        mixpanel.people.set_once({
          $email: me.get('email'), // only special properties need the $
          $created: me.get('created_at'),
          $first_name: me.get('first_name'),
          $last_name: me.get('last_name')
        });
        teams.forEach(team => {
          mixpanel.get_group('team_id', team.get('team_id')).set({
            name: team.get('name'),
            'Number of users': team.get('users').size,
            'Is paying': !!team.get('stripe_subscription_id')
          });
        });
      }
    }
  };
}
