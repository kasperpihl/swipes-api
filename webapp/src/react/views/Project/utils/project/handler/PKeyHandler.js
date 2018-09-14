export default class PKeyHandler {
  constructor(stateManager, state) {
    this.stateManager = stateManager;
    this.state = state;
    window.addEventListener('keydown', this.onKeyDown);
  }
  onKeyDown = e => {
    if (e.keyCode === 8) {
      // Backspace
      if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
        e.preventDefault();
        this.stateManager.editHandler.delete(e);
      }
    } else if (e.keyCode === 9) {
      // Tab
      e.preventDefault();
      if (e.shiftKey) this.stateManager.indentHandler.outdent();
      else this.stateManager.indentHandler.indent();
    } else if (e.keyCode === 13) {
      e.preventDefault();
      this.stateManager.editHandler.enter(e);
    } else if (e.keyCode === 37) {
      // Left arrow
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        this.stateManager.expandHandler.collapse();
      }
    } else if (e.keyCode === 38) {
      // Up arrow
      e.preventDefault();
      this.stateManager.selectHandler.selectPrev(e);
    } else if (e.keyCode === 39) {
      // Right arrow
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        this.stateManager.expandHandler.expand();
      }
    } else if (e.keyCode === 40) {
      // Down arrow
      e.preventDefault();
      this.stateManager.selectHandler.selectNext(e);
    } else if (e.keyCode === 90 && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (e.shiftKey) {
        this.stateManager.undoHandler.redo();
      } else {
        this.stateManager.undoHandler.undo();
      }
    }
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
  destroy = () => {
    window.removeEventListener('keydown', this.onKeyDown);
  };
}
