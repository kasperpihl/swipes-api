import ProjectCompleteHandler from './handler/ProjectCompleteHandler';
import ProjectEditHandler from './handler/ProjectEditHandler';
import ProjectExpandHandler from './handler/ProjectExpandHandler';
import ProjectIndentHandler from './handler/ProjectIndentHandler';
import ProjectKeyHandler from './handler/ProjectKeyHandler';
import ProjectSelectHandler from './handler/ProjectSelectHandler';
import ProjectSyncHandler from './handler/ProjectSyncHandler';
import ProjectUndoHandler from './handler/ProjectUndoHandler';

import projectGenerateLocalState from './projectGenerateLocalState';
import randomString from 'swipes-core-js/utils/randomString';
import projectUpdateSortedOrderFromOrder from './projectUpdateSortedOrderFromOrder';

/*
The responsibility of State Manager is to handle 
the full state for a ProjectOverview, it achieves this with help from
*/
export default class ProjectStateManager {
  constructor(serverState) {
    const clientState = projectUpdateSortedOrderFromOrder(serverState);
    const localState = projectGenerateLocalState(clientState);
    this.state = {
      clientState,
      localState
    };

    this.subscriptions = {};
    this.destroyHandlers = [];

    this.handlers = {
      completeHandler: new ProjectCompleteHandler(this),
      editHandler: new ProjectEditHandler(this),
      expandHandler: new ProjectExpandHandler(this),
      indentHandler: new ProjectIndentHandler(this),
      keyHandler: new ProjectKeyHandler(this),
      selectHandler: new ProjectSelectHandler(this),
      syncHandler: new ProjectSyncHandler(this),
      undoHandler: new ProjectUndoHandler(this)
    };
    Object.assign(this, this.handlers);
  }
  unsubscribe = subId => {
    delete this.subscriptions[subId];
  };
  subscribe = callback => {
    const subId = randomString(6);
    this.subscriptions[subId] = callback;
    return this.unsubscribe.bind(null, subId);
  };
  getClientState = () => this.state.clientState;
  getLocalState = () => this.state.localState;
  _update = (state, options) => {
    this.state = Object.assign({}, this.state, state);
    Object.values(this.subscriptions).forEach(callback =>
      callback(this, options)
    );
  };
  _onDestroy = callback => this.destroyHandlers.push(callback);
  destroy = () => this.destroyHandlers.forEach(callback => callback());
}
