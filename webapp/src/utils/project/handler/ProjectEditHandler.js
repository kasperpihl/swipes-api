import randomString from 'swipes-core-js/utils/randomString';
import projectIndentItemAndChildren from '../projectIndentItemAndChildren';
import projectUpdateHasChildrenForItem from '../projectUpdateHasChildrenForItem';
import { fromJS } from 'immutable';

export default class ProjectEditHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
  updateProjectName = name => {
    this.stateManager.update({ name });
  };
  updateTitle = (id, title) => {
    let { clientState } = this.state;
    clientState = clientState.setIn(['itemsById', id, 'title'], title);
    this.stateManager.update({ clientState }, `${id}-title`);
  };
  updateAssignees = (id, assignees) => {
    let { clientState } = this.state;
    clientState = clientState.setIn(['itemsById', id, 'assignees'], assignees);
    this.stateManager.update({ clientState });
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
    this.stateManager.syncHandler.delete(id);
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
      selectionStart
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
        title: nextTitle
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
        indent: newIndent
      })
    );
    order = projectUpdateHasChildrenForItem(order, i + 1);
    this.stateManager.update({
      itemsById,
      order,
      selectedIndex: selectedIndex + 1,
      selectionStart: 0
    });
  };
  // stateManager will set this, once an update happens.
  setState = state => {
    this.state = state;
  };
}
