import randomString from 'swipes-core-js/utils/randomString';
import projectIndentItemAndChildren from '../projectIndentItemAndChildren';
import projectUpdateHasChildrenForItem from '../projectUpdateHasChildrenForItem';
import { fromJS } from 'immutable';
import projectGenerateVisibleOrder from '../projectGenerateVisibleOrder';

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
  delete = id => {
    let { clientState, localState } = this.state;

    const visibleOrder = localState.get('visibleOrder');
    const visibleIndex = visibleOrder.findIndex(taskId => taskId === id);

    if (visibleIndex === 0) {
      return;
    }

    const currentTitle = clientState.getIn(['itemsById', id, 'title']);
    const prevId = visibleOrder.get(visibleIndex - 1);
    console.log(clientState.get('sortedOrder').toJS());
    clientState = clientState.set(
      'sortedOrder',
      clientState.get('sortedOrder').filter(taskId => taskId !== id)
    );
    console.log(clientState.get('sortedOrder').toJS());

    clientState = clientState.deleteIn(['completion', id]);
    clientState = clientState.deleteIn(['order', id]);
    clientState = clientState.deleteIn(['indent', id]);
    clientState = clientState.deleteIn(['itemsById', id]);
    localState = localState.deleteIn(['expanded', id]);
    localState = localState.deleteIn(['clientState', id]);
    localState = localState.set('selectedId', prevId);
    localState = localState.set('selectionStart', null);

    this.stateManager.syncHandler.delete(id);

    if (currentTitle) {
      const prevTitle = clientState.getIn(['itemsById', prevId, 'title']);
      localState = localState.set('selectionStart', prevTitle.length);
      clientState = clientState.setIn(
        ['itemsById', prevId, 'title'],
        prevTitle + currentTitle
      );
    }

    clientState = projectIndentItemAndChildren(clientState, prevId);
    localState = projectUpdateHasChildrenForItem(
      clientState,
      localState,
      prevId
    );
    localState = projectGenerateVisibleOrder(clientState, localState);
    console.log(id, localState.get('visibleOrder').size);
    this.stateManager.update({ localState, clientState });
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
