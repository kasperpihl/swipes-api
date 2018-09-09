import pIndentItemAndChildren from '../pIndentItemAndChildren';
import pUpdateHasChildrenForItem from '../pUpdateHasChildrenForItem';

export default class PIndentHandler {
  constructor(stateManager, state) {
    this.stateManager = stateManager;
    this.state = state;
  }
  enforceIndention = depth => {
    let { order } = this.state;
    order = order.map(item => item.set('expanded', item.get('indent') < depth));
    this.stateManager.update({
      sliderValue: depth,
      order,
    });
  };
  indent = iOrId => {
    const { order } = this.state;
    const i = this.stateManager._iFromVisibleIOrId(iOrId);
    const modifier = 1;

    let newOrder = pIndentItemAndChildren(order, i, modifier);
    newOrder = pUpdateHasChildrenForItem(newOrder, i);

    this.stateManager.update({
      order: newOrder,
    });
  };
  outdent = iOrId => {
    const { order } = this.state;
    const i = this.stateManager._iFromVisibleIOrId(iOrId);
    const modifier = -1;

    let newOrder = pIndentItemAndChildren(order, i, modifier);
    newOrder = pUpdateHasChildrenForItem(newOrder, i);
    this.stateManager.update({
      order: newOrder,
    });
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
