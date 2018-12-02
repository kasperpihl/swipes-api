import projectGenerateVisibleOrder from '../projectGenerateVisibleOrder';

export default class ProjectExpandHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
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
    localState = localState.set(
      'visibleOrder',
      projectGenerateVisibleOrder(clientState, localState)
    );
    this.stateManager.update({ localState });
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
