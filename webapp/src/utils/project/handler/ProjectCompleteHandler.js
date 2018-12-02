import projectCompleteItemWithChildren from 'src/utils/project/projectCompleteItemWithChildren';
import projectValidateCompletion from 'src/utils/project/projectValidateCompletion';

export default class ProjectCompleteHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
  complete = id => {
    let { clientState } = this.state;
    clientState = projectCompleteItemWithChildren(clientState, id, true);
    clientState = projectValidateCompletion(clientState);
    this.stateManager.update({ clientState });
  };
  incomplete = id => {
    let { clientState } = this.state;
    clientState = projectCompleteItemWithChildren(clientState, id, false);
    clientState = projectValidateCompletion(clientState);
    this.stateManager.update({ clientState });
  };

  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
