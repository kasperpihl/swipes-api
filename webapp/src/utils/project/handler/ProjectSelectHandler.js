export default class ProjectSelectHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
  selectNext = (selectionStart = null) => {
    this._selectWithModifier(1, selectionStart);
  };
  selectPrev = (selectionStart = null) => {
    this._selectWithModifier(-1, selectionStart);
  };
  _selectWithModifier = (modifier, selectionStart) => {
    let { localState } = this.state;
    const selectedId = localState.get('selectedId');
    const visibleOrder = localState.get('visibleOrder');
    const visibleI = visibleOrder.findIndex(taskId => taskId === selectedId);
    const nextI = (visibleI + modifier) % visibleOrder.size;

    localState = localState
      .set('selectedId', visibleOrder.get(nextI))
      .set('selectionStart', selectionStart);

    this.stateManager.update({ localState }, false);
  };
  select = id => {
    this._selectValue(id);
  };
  deselect = () => {
    this._selectValue(null);
  };
  _selectValue = value => {
    let { localState } = this.state;
    if (localState.get('selectedId') !== value) {
      localState = localState.set('selectedId', value);
      this.stateManager.update({ localState }, false);
    }
  };

  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
