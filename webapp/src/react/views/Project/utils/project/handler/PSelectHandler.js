export default class PSelectHandler {
  constructor(stateManager, state) {
    this.stateManager = stateManager;
    this.state = state;
  }
  selectNext = e => {
    const { visibleOrder, selectedIndex } = this.state;
    let nextIndex = selectedIndex + 1;
    console.log(nextIndex);
    if (nextIndex >= visibleOrder.size) nextIndex = 0;
    this.stateManager.update({ selectedIndex: nextIndex });
  };
  selectPrev = e => {
    const { visibleOrder, selectedIndex } = this.state;
    let prevIndex = selectedIndex - 1;
    if (prevIndex < 0) prevIndex = visibleOrder.size - 1;
    this.stateManager.update({ selectedIndex: prevIndex });
  };
  selectWithId = id => {
    const { selectedIndex } = this.state;
    const visibleI = this.stateManager._visibleIFromId(id);
    if (selectedIndex !== visibleI) {
      this.stateManager.update({ selectedIndex: visibleI });
    }
  };
  deselectId = id => {
    const { selectedIndex } = this.state;
    const visibleI = this.stateManager._visibleIFromId(id);
    if (selectedIndex === visibleI) {
      this.stateManager.update({ selectedIndex: -1 });
    }
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
