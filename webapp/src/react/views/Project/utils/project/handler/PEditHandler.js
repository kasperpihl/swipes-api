export default class PEditHandler {
  constructor(stateManager, state) {
    this.stateManager = stateManager;
    this.state = state;
  }
  updateTitle = (id, title) => {
    let { itemsById } = this.state;
    itemsById = itemsById.setIn([id, 'title'], title);
    this.stateManager.update({ itemsById });
  };
  addAttachment = (id, attachment) => {
    let { itemsById } = this.state;
    itemsById = itemsById.setIn([id, 'type'], 'attachment');
    itemsById = itemsById.setIn([id, 'title'], attachment.get('title'));
    itemsById = itemsById.setIn([id, 'attachment'], attachment);
    this.stateManager.update({ itemsById });
  };
  updateAssignees = (id, assignees) => {
    let { itemsById } = this.state;
    itemsById = itemsById.setIn([id, 'assignees'], assignees);
    this.stateManager.update({ itemsById });
  };
  onDelete = id => {
    let { itemsById, order } = this.state;

    const i = order.findIndex(item => item.get('id') === id);
    const currentTitle = itemsById.getIn([id, 'title']);
    if (i > 0) {
      order = order.delete(i);
      itemsById = itemsById.delete(id);
      this.focusI = Math.max(i - 1, 0);
      const prevId = order.getIn([i - 1, 'id']);
      if (currentTitle) {
        const prevTitle = itemsById.getIn([prevId, 'title']);
        this.selectionStart = prevTitle.length;
        itemsById = itemsById.setIn(
          [order.getIn([i - 1, 'id']), 'title'],
          prevTitle + currentTitle
        );
      }
      order = indentWithChildren(order, i - 1);
      order = updateHasChildrenForItem(order, i - 1);
      this.setState({ itemsById, order });
    }
  };
  onEnter = e => {
    let { itemsById, order, selectedIndex } = this.state;
    const selectionStart = e.target.selectionStart;
    const id = this.stateManager._idFromVisibleI(selectedIndex);
    const i = order.findIndex(item => item.get('id') === id);
    const currentItem = itemsById.get(id);
    let currTitle = currentItem.get('title');
    let nextTitle = '';
    if (selectionStart < currentItem.get('title').length) {
      nextTitle = currTitle.slice(selectionStart);
      currTitle = currTitle.slice(0, selectionStart);
      itemsById = itemsById.setIn([id, 'title'], currTitle);
    }
    const newId = randomString(5);
    itemsById = itemsById.set(
      newId,
      fromJS({
        id: newId,
        title: nextTitle,
        type: 'task',
      })
    );
    order = order.insert(
      i + 1,
      fromJS({
        id: newId,
        indent: order.getIn([i, 'indent']),
      })
    );
    order = updateHasChildrenForItem(order, i + 1);
    this.focusI = i + 1;
    this.selectionStart = 0;
    if (selectionStart === 0 && !currTitle && nextTitle) {
      this.focusI = i;
    }
    this.setState({
      itemsById,
      order,
    });
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
