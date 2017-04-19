export default class Milestones {
  constructor(store, parent) {
    this.store = store;
    this.parent = parent;
  }
  getMilestone(milestone) {
    if(typeof milestone === 'string'){
      const state = this.store.getState();
      return state.getIn(['milestones', milestone]);
    }
    return milestone;
  }
  getName(milestoneId) {
    if(milestoneId === 'none'){
      return 'no milestone';
    }
    const milestone = this.getMilestone(milestoneId);
    if(milestone){
      return milestone.get('title');
    }
    return 'any milestone';
  }
  getGoals(milestoneId, overrideGoals) {
    const milestone = this.getMilestone(milestoneId);
    const state = this.store.getState();
    const goals = overrideGoals || state.get('goals');
    return milestone.get('goal_order')
                    .map(gId => goals.get(gId));
  }
}
