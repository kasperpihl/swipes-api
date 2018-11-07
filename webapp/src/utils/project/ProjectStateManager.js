import ProjectEditHandler from './handler/ProjectEditHandler';
import ProjectExpandHandler from './handler/ProjectExpandHandler';
import ProjectIndentHandler from './handler/ProjectIndentHandler';
import ProjectKeyHandler from './handler/ProjectKeyHandler';
import ProjectSelectHandler from './handler/ProjectSelectHandler';
import ProjectSyncHandler from './handler/ProjectSyncHandler';
import ProjectUndoHandler from './handler/ProjectUndoHandler';

import projectConvertServerToLocal from './projectConvertServerToLocal';
import projectGenerateVisibleRows from './projectGenerateVisibleRows';
import { fromJS } from 'immutable';

/*
The responsibility of State Manager is to handle 
the full state for a ProjectOverview, it achieves this with help from
*/
export default class ProjectStateManager {
  constructor(serverState, onStateChange) {
    const [order, itemsById] = projectConvertServerToLocal(serverState);
    this.state = {
      name: '',
      order,
      visibleOrder: projectGenerateVisibleRows(order, itemsById),
      itemsById,
      selectedIndex: -1,
      sliderValue: 0
    };
    this.onStateChange = onStateChange;

    this.handlers = {
      editHandler: new ProjectEditHandler(this),
      expandHandler: new ProjectExpandHandler(this),
      indentHandler: new ProjectIndentHandler(this),
      keyHandler: new ProjectKeyHandler(this),
      selectHandler: new ProjectSelectHandler(this),
      syncHandler: new ProjectSyncHandler(this),
      undoHandler: new ProjectUndoHandler(this)
    };
    this.callHandlers('setRawServerState', serverState);
    this.callHandlers('setState', this.state);
    Object.assign(this, this.handlers);
  }
  callHandlers = (method, ...args) => {
    for (let key in this.handlers) {
      typeof this.handlers[key][method] === 'function' &&
        this.handlers[key][method](...args);
    }
  };
  getState = () => this.state;
  parseServerData = () => {};
  update = (state, undoString = true) => {
    // Whenever we update order, make sure to update what is visible
    if (state.order || state.itemsById) {
      state.visibleOrder = projectGenerateVisibleRows(
        state.order || this.state.order,
        state.itemsById || this.state.itemsById
      );
    }
    // If selection is by id, ensure correct visible i
    if (state.selectedId) {
      state.selectedIndex = state.visibleOrder.findIndex(
        o => o.get('id') === state.selectedId
      );
      delete state.selectedId;
    }
    // If I select a new row, but do not set selectionStart, make sure old is not used
    if (
      typeof state.selectedIndex === 'number' &&
      typeof state.selectionStart !== 'number'
    ) {
      state.selectionStart = null;
    }
    const newState = Object.assign({}, this.state, state);
    this.undoHandler.pushToUndoStack(undoString);
    this._updateState(newState);
  };
  _updateState(state) {
    this.state = state;
    this.onStateChange(this.state);
    this.callHandlers('setState', this.state);
  }
  destroy = () => this.callHandlers('destroy');
  _iFromVisibleIOrId = iOrId => {
    if (typeof iOrId === 'number') {
      return this._iFromVisibleI(iOrId);
    }
    return this._iFromId(iOrId);
  };
  _idFromI = i => this.state.order.getIn([i, 'id']);
  _idFromVisibleI = i => this.state.visibleOrder.getIn([i, 'id']);
  _iFromId = id => this.state.order.findIndex(o => o.get('id') === id);
  _iFromVisibleI = i => this._iFromId(this._idFromVisibleI(i));
  _visibleIFromId = id =>
    this.state.visibleOrder.findIndex(o => o.get('id') === id);
}
