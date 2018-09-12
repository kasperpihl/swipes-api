import pIndentItemAndChildren from '../pIndentItemAndChildren';
import pUpdateHasChildrenForItem from '../pUpdateHasChildrenForItem';
import pForceParentExpandedForItem from '../pForceParentExpandedForItem';

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
  indent = id => {
    const { order, selectedIndex } = this.state;
    const i = this.stateManager._iFromVisibleIOrId(id || selectedIndex);
    id = this.stateManager._idFromI(i);
    let newOrder = pIndentItemAndChildren(order, i, 1);
    newOrder = pUpdateHasChildrenForItem(newOrder, i);
    newOrder = pForceParentExpandedForItem(newOrder, i);

    // Use selectedId, cause if we force expand parent, selected index gets messed up
    this.stateManager.update({
      selectedId: id,
      order: newOrder,
    });
  };
  outdent = id => {
    const { order, selectedIndex } = this.state;
    const i = this.stateManager._iFromVisibleIOrId(id || selectedIndex);

    let newOrder = pIndentItemAndChildren(order, i, -1);
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
