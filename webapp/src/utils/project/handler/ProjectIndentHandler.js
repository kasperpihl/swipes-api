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
    let clientState = this.stateManager.getClientState();
    let localState = this.stateManager.getLocalState();

    clientState = projectIndentTaskAndChildren(clientState, id, modifier);
    localState = projectUpdateHasChildrenForTask(clientState, localState, id);
    localState = projectForceParentExpandedForTask(clientState, localState, id);
    clientState = projectValidateCompletion(clientState);
    this.stateManager._update({
      clientState,
      localState
    });
  };
}
