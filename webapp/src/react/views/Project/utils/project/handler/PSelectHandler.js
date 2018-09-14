export default class PSelectHandler {
  constructor(stateManager, state) {
    this.stateManager = stateManager;
    this.state = state;
  }
  selectNext = e => {
    const { visibleOrder, selectedIndex } = this.state;
    let nextIndex = selectedIndex + 1;
    if (nextIndex >= visibleOrder.size) nextIndex = 0;
    this.stateManager.update(
      {
        selectedIndex: nextIndex,
        selectionStart: e.target.selectionStart,
      },
      {
        dontTrackUndo: true,
      }
    );
  };
  selectPrev = e => {
    const { visibleOrder, selectedIndex } = this.state;
    let prevIndex = selectedIndex - 1;
    if (prevIndex < 0) prevIndex = visibleOrder.size - 1;
    this.stateManager.update(
      {
        selectedIndex: prevIndex,
        selectionStart: e.target.selectionStart,
      },
      {
        dontTrackUndo: true,
      }
    );
  };
  selectWithId = id => {
    const { selectedIndex } = this.state;
    const visibleI = this.stateManager._visibleIFromId(id);
    if (selectedIndex !== visibleI) {
      this.stateManager.update(
        {
          selectedIndex: visibleI,
        },
        {
          dontTrackUndo: true,
        }
      );
    }
  };
  deselectId = id => {
    const { selectedIndex } = this.state;
    const visibleI = this.stateManager._visibleIFromId(id);
    if (selectedIndex === visibleI) {
      this.stateManager.update(
        { selectedIndex: -1 },
        {
          dontTrackUndo: true,
        }
      );
    }
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
