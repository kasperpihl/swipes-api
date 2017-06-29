export default class AutoComplete {
  constructor(store) {
    this.store = store;
  }
  open(e, options) {
    const results = this.findResults(e.target.value, options);
    this.store.dispatch({ type: 'AUTO_COMPLETE', payload: {
      boundingRect: e.target.boundingRect,
      results,
    }})
  }
  findResults(string, options) {
    let defs = {
      types: ['milestones', 'goals', 'users'],
    };
    defs = Object.assign(defs, options);
    const results = [];
    if(def.types.indexOf('goals') > -1) {
      this.store.getState().get('goals').forEach((g) => {
      })
    }
  }
  close() {
    this.store.dispatch({ type: 'AUTO_COMPLETE', payload: null });
  }
}
