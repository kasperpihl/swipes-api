import ProjectCompleteHandler from './handler/ProjectCompleteHandler';
import ProjectEditHandler from './handler/ProjectEditHandler';
import ProjectExpandHandler from './handler/ProjectExpandHandler';
import ProjectIndentHandler from './handler/ProjectIndentHandler';
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
    this._clientState = projectUpdateSortedOrderFromOrder(serverState);
    this._localState = projectGenerateLocalState(this._clientState);

    this._subscriptions = {};
    this._destroyHandlers = [];

    this.completeHandler = new ProjectCompleteHandler(this);
    this.editHandler = new ProjectEditHandler(this);
    this.expandHandler = new ProjectExpandHandler(this);
    this.indentHandler = new ProjectIndentHandler(this);
    this.selectHandler = new ProjectSelectHandler(this);
    this.syncHandler = new ProjectSyncHandler(this);
    this.undoHandler = new ProjectUndoHandler(this);
  }
  unsubscribe = subId => {
    delete this._subscriptions[subId];
  };
  subscribe = callback => {
    const subId = randomString(6);
    this._subscriptions[subId] = callback;
    return this.unsubscribe.bind(null, subId);
  };
  getClientState = () => this._clientState;
  getLocalState = () => this._localState;
  // Used by all the handlers when they want to update the state.
  _update = ({ localState, clientState }, options = {}) => {
    if (localState || clientState) {
      this._localState = localState || this._localState;
      this._clientState = clientState || this._clientState;
      Object.values(this._subscriptions).forEach(callback =>
        callback(this, options)
      );
    }
  };
}
