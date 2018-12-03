import projectCompleteItemWithChildren from 'src/utils/project/projectCompleteItemWithChildren';
import projectValidateCompletion from 'src/utils/project/projectValidateCompletion';

export default class ProjectCompleteHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
  complete = id => {
    this._completeById(id, true);
  };
  incomplete = id => {
    this._completeById(id, false);
  };
  _completeById = (id, complete) => {
    let { clientState } = this.state;
    clientState = projectCompleteItemWithChildren(clientState, id, complete);
    clientState = projectValidateCompletion(clientState);
    this.stateManager.update({ clientState });
  };

  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
