
export default class FilterHandler {
  constructor(store) {
    this.store = store;
    bindAll(this, ['storeChange']);
    store.subscribe(this.storeChange);
  }
}
