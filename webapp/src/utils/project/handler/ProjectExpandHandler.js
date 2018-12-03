import projectGenerateVisibleOrder from '../projectGenerateVisibleOrder';

export default class ProjectExpandHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
  setDepth = depth => {
    let { localState, clientState } = this.state;
    clientState.get('sortedOrder').forEach(taskId => {
      const indention = clientState.getIn(['indention', taskId]);
      const shouldBeExpanded = indention < depth;
      if (localState.getIn(['expanded', taskId]) !== shouldBeExpanded) {
        localState = localState.setIn(['expanded', taskId], shouldBeExpanded);
      }
    });
    localState = projectGenerateVisibleOrder(clientState, localState);
    this.stateManager.update({
      localState
    });
  };
  expand = id => {
    this._expandById(id, true);
  };
  collapse = id => {
    this._expandById(id, false);
  };
  _expandById = (id, expand) => {
    let { localState, clientState } = this.state;
    if (!localState.getIn(['hasChildren', id])) return;
    localState = localState.setIn(['expanded', id], expand);
    localState = projectGenerateVisibleOrder(clientState, localState);
    this.stateManager.update({ localState });
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
