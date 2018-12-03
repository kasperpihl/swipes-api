import projectIndentItemAndChildren from '../projectIndentItemAndChildren';
import projectUpdateHasChildrenForItem from '../projectUpdateHasChildrenForItem';
import projectForceParentExpandedForItem from '../projectForceParentExpandedForItem';
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
    clientState = projectIndentItemAndChildren(clientState, id, modifier);
    localState = projectUpdateHasChildrenForItem(clientState, localState, id);
    localState = projectForceParentExpandedForItem(clientState, localState, id);
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
