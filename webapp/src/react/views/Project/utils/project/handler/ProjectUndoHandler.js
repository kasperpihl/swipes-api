import { fromJS } from 'immutable';

export default class PKeyHandler {
  constructor(stateManager, state) {
    this.stateManager = stateManager;
    this.state = state;
    this.redoStack = fromJS([]);
    this.undoStack = fromJS([]);
  }
  undo = () => {
    const lastState = this.undoStack.last();
    if (lastState) {
      this.redoStack = this.redoStack.push(this.state);
      this.undoStack = this.undoStack.butLast();
      this.didTheUpdate = true;
      this.stateManager._updateState(lastState);
    }
  };
  redo = () => {
    const lastState = this.redoStack.last();
    if (lastState) {
      this.undoStack = this.undoStack.push(this.state);
      this.redoStack = this.redoStack.butLast();
      this.didTheUpdate = true;
      this.stateManager._updateState(lastState);
    }
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    if (!this.didTheUpdate) {
      this.undoStack = this.undoStack.push(this.state).takeLast(10);
    }
    this.didTheUpdate = undefined;
    this.state = state;
  };
}
