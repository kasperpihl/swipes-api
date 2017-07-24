export default class Me {
  constructor(store) {
    this.store = store;
  }
  beta(flag) {
    const me = this.getMe();
    if(me) {
      const org = me.getIn(['organizations', 0]);
      if(org.get('beta_flags') && org.get('beta_flags').contains(flag)) {
        return true;
      }
    }
    return false;
  }
  getMe(){
    return this.store.getState().get('me');
  }
  isAdmin() {
    const me = this.getMe();
    if(me) {
      const uId = me.get('id');
      const org = me.getIn(['organizations', 0]);
      if(org) {
        return org.get('admins').contains(uId) || org.get('owner_id') === uId;
      }
    }
    return false;
  }
}
