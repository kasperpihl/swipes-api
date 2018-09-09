export default class PKeyHandler {
  constructor(stateManager, state) {
    this.stateManager = stateManager;
    this.state = state;
    window.addEventListener('keydown', this.onKeyDown);
  }
  onKeyDown = e => {
    console.log(e.target);
    if (e.keyCode === 9) {
      // Tab
      e.preventDefault();
      if (e.shiftKey) this.stateManager.indentHandler.outdent();
      else this.stateManager.indentHandler.indent();
    } else if (e.keyCode === 37) {
      // Left arrow
      e.preventDefault();
      this.stateManager.expandHandler.collapse();
    } else if (e.keyCode === 38) {
      // Up arrow
      e.preventDefault();
      this.stateManager.selectHandler.selectPrev(e);
    } else if (e.keyCode === 39) {
      // Right arrow
      e.preventDefault();
      this.stateManager.expandHandler.expand();
    } else if (e.keyCode === 40) {
      // Down arrow
      e.preventDefault();
      this.stateManager.selectHandler.selectNext(e);
    }
  };
  onInputKeyDown = e => {
    // NOT WIRED UP YET
    const id = item.get('id');

    if (e.keyCode === 8) {
      // Backspace
      if (
        e.target.selectionStart === 0 &&
        e.target.selectionEnd === 0 &&
        onDelete
      ) {
        e.preventDefault();
        onDelete(id);
      }
    } else if (e.keyCode === 9 && onTab) {
      // Tab
      e.preventDefault();
      onTab(id, e);
    } else if (e.keyCode === 13 && onEnter) {
      // Enter
      e.preventDefault();
      onEnter(id, e.target.selectionStart);
    } else if (e.keyCode === 38 && onUpArrow) {
      // Up arrow
      e.preventDefault();
      onUpArrow(id, e.target.selectionStart);
    } else if (e.keyCode === 40 && onDownArrow) {
      // Down arrow
      e.preventDefault();
      onDownArrow(id, e.target.selectionStart);
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
