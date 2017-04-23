import moment from 'moment';

export default class Milestones {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  isValid() {
    const org = this.store.getState().getIn(['me', 'organizations', 0]);
    const now = moment();
    const trial = org.get('trial');
    return false;
  }
}
