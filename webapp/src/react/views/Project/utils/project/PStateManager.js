import PEditHandler from './handler/PEditHandler';
import PExpandHandler from './handler/PExpandHandler';
import PIndentHandler from './handler/PIndentHandler';
import PKeyHandler from './handler/PKeyHandler';
import PSelectHandler from './handler/PSelectHandler';

import pGenerateVisibleOrder from './pGenerateVisibleOrder';

/*
The responsibility of State Manager is to handle 
the full state for a ProjectOverview, it achieves this with help from
*/
export default class PStateManager {
  constructor(order, itemsById, onStateChange) {
    this.state = {
      order,
      visibleOrder: pGenerateVisibleOrder(order),
      itemsById,
      selectedIndex: 0,
      sliderValue: 0,
    };
    this.onStateChange = onStateChange;

    this.handlers = {
      editHandler: new PEditHandler(this),
      expandHandler: new PExpandHandler(this),
      indentHandler: new PIndentHandler(this),
      keyHandler: new PKeyHandler(this),
      selectHandler: new PSelectHandler(this),
    };
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
  update = state => {
    if (state.order) {
      state.visibleOrder = pGenerateVisibleOrder(state.order);
    }
    this.state = Object.assign(this.state, state);
    this.onStateChange(this.state);
    this.callHandlers('setState', this.state);
  };
  destroy = () => this.callHandlers('destroy');
  _iFromVisibleIOrId = iOrId => {
    const { selectedIndex } = this.state;
    if (typeof iOrId === 'string') {
      return this._iFromId(iOrId);
    } else if (typeof iOrId === 'number') {
      return this._iFromVisibleI(iOrId);
    }
    return this._iFromVisibleI(selectedIndex);
  };
  _idFromI = i => this.state.order.getIn([i, 'id']);
  _idFromVisibleI = i => this.state.visibleOrder.getIn([i, 'id']);
  _iFromId = id => this.state.order.findIndex(o => o.get('id') === id);
  _iFromVisibleI = i => this._iFromId(this._idFromVisibleI(i));
}
