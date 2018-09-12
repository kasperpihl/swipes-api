export default class PExpandHandler {
  constructor(stateManager, state) {
    this.stateManager = stateManager;
    this.state = state;
  }
  toggleExpandForId = id => {
    const { order } = this.state;
    const i = this.stateManager._iFromId(id);
    if (order.getIn([i, 'expanded'])) {
      return this.collapse(id);
    }
    return this.expand(id);
  };
  expand = id => {
    let { order, selectedIndex } = this.state;
    const i = this.stateManager._iFromVisibleIOrId(id || selectedIndex);
    if (!order.getIn([i, 'hasChildren'])) return;

    this.stateManager.update({ order: order.setIn([i, 'expanded'], true) });
  };
  collapse = id => {
    let { order, selectedIndex } = this.state;
    const i = this.stateManager._iFromVisibleIOrId(id || selectedIndex);
    if (!order.getIn([i, 'hasChildren'])) return;

    this.stateManager.update({ order: order.setIn([i, 'expanded'], false) });
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
