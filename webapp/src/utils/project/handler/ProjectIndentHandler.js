import projectIndentTaskAndChildren from '../projectIndentTaskAndChildren';
import projectUpdateHasChildrenForTask from '../projectUpdateHasChildrenForTask';
import projectForceParentExpandedForTask from '../projectForceParentExpandedForTask';
import projectValidateCompletion from '../projectValidateCompletion';

export default class ProjectIndentHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
  indent = id => {
    this._indentWithModifier(id, 1);
  };
  outdent = id => {
    this._indentWithModifier(id, -1);
  };
  _indentWithModifier = (id, modifier) => {
    let { clientState, localState } = this.state;
    clientState = projectIndentTaskAndChildren(clientState, id, modifier);
    localState = projectUpdateHasChildrenForTask(clientState, localState, id);
    localState = projectForceParentExpandedForTask(clientState, localState, id);
    clientState = projectValidateCompletion(clientState);
    this.stateManager.update({
      clientState,
      localState
    });
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
