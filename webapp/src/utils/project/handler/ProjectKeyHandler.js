export default class ProjectKeyHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
    window.addEventListener('keydown', this.onKeyDown);
    stateManager._onDestroy(() => {
      window.removeEventListener('keydown', this.onKeyDown);
    });
  }
  onKeyDown = e => {
    const localState = this.stateManager.getLocalState();

    const selectedId = localState.get('selectedId');
    if (!selectedId) return;
    if (e.keyCode === 8) {
      // Backspace
      if (e.target.selectionStart === 0 && e.target.selectionEnd === 0) {
        e.preventDefault();
        this.stateManager.editHandler.delete(selectedId);
      }
    } else if (e.keyCode === 9) {
      // Tab
      e.preventDefault();
      if (e.shiftKey) this.stateManager.indentHandler.outdent(selectedId);
      else this.stateManager.indentHandler.indent(selectedId);
    } else if (e.keyCode === 13) {
      e.preventDefault();
      this.stateManager.editHandler.enter(selectedId, e.target.selectionStart);
    } else if (e.keyCode === 37) {
      // Left arrow
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        this.stateManager.expandHandler.collapse(selectedId);
      }
    } else if (e.keyCode === 38) {
      // Up arrow
      e.preventDefault();
      this.stateManager.selectHandler.selectPrev(e.target.selectionStart);
    } else if (e.keyCode === 39) {
      // Right arrow
      if (e.metaKey || e.ctrlKey) {
        e.preventDefault();
        this.stateManager.expandHandler.expand(selectedId);
      }
    } else if (e.keyCode === 40) {
      // Down arrow
      e.preventDefault();
      this.stateManager.selectHandler.selectNext(e.target.selectionStart);
    } else if (e.keyCode === 90 && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (e.shiftKey) {
        this.stateManager.undoHandler.redo();
      } else {
        this.stateManager.undoHandler.undo();
      }
    }
  };
}
