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

/*
The responsibility of State Manager is to handle 
the full state for a ProjectOverview, it achieves this with help from
*/
export default class ProjectStateManager {
  constructor(serverState) {
    const clientState = serverState.set(
      'sortedOrder',
      serverState
        .get('ordering')
        .sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        })
        .keySeq()
        .toList()
    );
    const localState = projectGenerateLocalState(clientState);
    this.state = {
      clientState,
      localState
    };

    this.subscriptions = {};

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
    this.callHandlers('setState', this.state);
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
  callHandlers = (method, ...args) => {
    for (let key in this.handlers) {
      typeof this.handlers[key][method] === 'function' &&
        this.handlers[key][method](...args);
    }
  };
  getClientState = () => this.state.clientState;
  getLocalState = () => this.state.localState;
  parseServerData = () => {};
  update = (state, undoString = true) => {
    const newState = Object.assign({}, this.state, state);
    this.undoHandler.pushToUndoStack(undoString);
    this._updateState(newState);
  };
  _updateState = state => {
    this.state = state;
    this.callHandlers('setState', this.state);
    for (let subId in this.subscriptions) {
      this.subscriptions[subId](this);
    }
  };
  destroy = () => this.callHandlers('destroy');
}
