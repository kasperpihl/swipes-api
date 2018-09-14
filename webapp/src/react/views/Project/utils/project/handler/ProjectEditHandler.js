import randomString from 'swipes-core-js/utils/randomString';
import projectIndentItemAndChildren from '../projectIndentItemAndChildren';
import projectUpdateHasChildrenForItem from '../projectUpdateHasChildrenForItem';
import { fromJS } from 'immutable';

export default class PEditHandler {
  constructor(stateManager, state) {
    this.stateManager = stateManager;
    this.state = state;
  }
  updateTitle = (id, title) => {
    let { itemsById } = this.state;
    itemsById = itemsById.setIn([id, 'title'], title);
    this.stateManager.update({ itemsById }, `${id}-title`);
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
  delete = e => {
    let { itemsById, order, selectedIndex, visibleOrder } = this.state;
    const id = this.stateManager._idFromVisibleI(selectedIndex);
    const i = order.findIndex(item => item.get('id') === id);
    const currentTitle = itemsById.getIn([id, 'title']);
    if (i === 0) {
      return;
    }

    order = order.delete(i);
    itemsById = itemsById.delete(id);
    selectedIndex = selectedIndex - 1;

    let selectionStart = null;

    const prevId = visibleOrder.getIn([selectedIndex, 'id']);
    const prevI = this.stateManager._iFromVisibleI(selectedIndex);
    if (currentTitle) {
      const prevTitle = itemsById.getIn([prevId, 'title']);
      selectionStart = prevTitle.length;
      itemsById = itemsById.setIn([prevId, 'title'], prevTitle + currentTitle);
    }
    order = projectIndentItemAndChildren(order, prevI);
    order = projectUpdateHasChildrenForItem(order, prevI);
    this.stateManager.update({
      itemsById,
      order,
      selectedIndex,
      selectionStart,
    });
  };
  enter = e => {
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

    let nextI = this.stateManager._iFromVisibleI(selectedIndex + 1);
    let newIndent = order.getIn([i, 'indent']);
    if (nextI === -1) {
      nextI = order.size;
    } else {
      newIndent = Math.max(
        order.getIn([nextI, 'indent']),
        order.getIn([i, 'indent'])
      );
    }

    order = order.insert(
      nextI,
      fromJS({
        id: newId,
        indent: newIndent,
      })
    );
    order = projectUpdateHasChildrenForItem(order, i + 1);
    this.stateManager.update({
      itemsById,
      order,
      selectedIndex: selectedIndex + 1,
      selectionStart: 0,
    });
  };
  add = () => {
    let { itemsById, order, visibleOrder } = this.state;
    const newId = randomString(5);
    itemsById = itemsById.set(
      newId,
      fromJS({
        id: newId,
        title: '',
        type: 'task',
      })
    );
    order = order.push(
      fromJS({
        id: newId,
        indent: 0,
      })
    );

    this.stateManager.update({
      itemsById,
      order,
      selectedIndex: visibleOrder.size,
    });
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
