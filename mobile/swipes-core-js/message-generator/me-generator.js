export default class Me {
  constructor(store) {
    this.store = store;
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
