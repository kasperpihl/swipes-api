import randomString from 'swipes-core-js/utils/randomString';
import projectIndentTaskAndChildren from '../projectIndentTaskAndChildren';
import projectUpdateHasChildrenForTask from '../projectUpdateHasChildrenForTask';
import { fromJS } from 'immutable';
import projectGenerateVisibleOrder from '../projectGenerateVisibleOrder';
import projectUpdateOrderFromSortedOrder from '../projectUpdateOrderFromSortedOrder';
import projectValidateCompletion from '../projectValidateCompletion';

export default class ProjectEditHandler {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }
  updateProjectName = name => {
    this.stateManager._update({ name });
  };
  updateTitle = (id, title) => {
    let clientState = this.stateManager.getClientState();
    clientState = clientState.setIn(['tasksById', id, 'title'], title);
    this.stateManager._update({ clientState }, `${id}-title`);
  };
  updateAssignees = (id, assignees) => {
    let clientState = this.stateManager.getClientState();
    clientState = clientState.setIn(['tasksById', id, 'assignees'], assignees);
    this.stateManager._update({ clientState });
  };
  delete = id => {
    let clientState = this.stateManager.getClientState();
    let localState = this.stateManager.getLocalState();

    const visibleOrder = localState.get('visibleOrder');
    const visibleIndex = visibleOrder.findIndex(taskId => taskId === id);

    if (visibleIndex === 0) {
      return;
    }

    const currentTitle = clientState.getIn(['tasksById', id, 'title']);
    const prevId = visibleOrder.get(visibleIndex - 1);

    clientState = clientState.set(
      'sortedOrder',
      clientState.get('sortedOrder').filter(taskId => taskId !== id)
    );
    clientState = clientState.deleteIn(['ordering', id]);
    clientState = clientState.deleteIn(['completion', id]);
    clientState = clientState.deleteIn(['indention', id]);
    clientState = clientState.deleteIn(['tasksById', id]);

    this.stateManager.syncHandler.delete(id);

    localState = localState.deleteIn(['expanded', id]);
    localState = localState.deleteIn(['clientState', id]);
    localState = localState.set('selectedId', prevId);
    localState = localState.set('selectionStart', null);

    if (currentTitle) {
      const prevTitle = clientState.getIn(['tasksById', prevId, 'title']);
      localState = localState.set('selectionStart', prevTitle.length);
      clientState = clientState.setIn(
        ['tasksById', prevId, 'title'],
        prevTitle + currentTitle
      );
    }

    clientState = projectIndentTaskAndChildren(clientState, prevId);
    localState = projectUpdateHasChildrenForTask(
      clientState,
      localState,
      prevId
    );
    clientState = projectValidateCompletion(clientState);

    localState = projectGenerateVisibleOrder(clientState, localState);
    this.stateManager._update({ localState, clientState });
  };
  enter = (id, selectionStart = null) => {
    let clientState = this.stateManager.getClientState();
    let localState = this.stateManager.getLocalState();

    let currTitle = clientState.getIn(['tasksById', id, 'title']);
    if (typeof selectionStart !== 'number') {
      selectionStart = currTitle.length;
    }
    let nextTitle = '';
    if (selectionStart < currTitle.length) {
      nextTitle = currTitle.slice(selectionStart);
      currTitle = currTitle.slice(0, selectionStart);
      clientState = clientState.setIn(['tasksById', id, 'title'], currTitle);
    }

    const newId = randomString(5);
    clientState = clientState.setIn(
      ['tasksById', newId],
      fromJS({
        task_id: newId,
        title: nextTitle,
        due_date: null
      })
    );
    localState = localState.setIn(['expanded', newId], false);
    localState = localState.setIn(['hasChildren', newId], false);
    localState = localState.set('selectedId', newId);
    localState = localState.set('selectionStart', 0);

    const nextIndex = clientState.getIn(['ordering', id]) + 1;
    const nextId = clientState.getIn(['sortedOrder', nextIndex]);
    const currentIndention = clientState.getIn(['indention', id]);
    const nextIndention = clientState.getIn(['indention', nextId]) || 0;

    clientState = clientState.setIn(
      ['indention', newId],
      Math.max(currentIndention, nextIndention)
    );

    clientState = clientState.set(
      'sortedOrder',
      clientState.get('sortedOrder').insert(nextIndex, newId)
    );

    clientState = projectUpdateOrderFromSortedOrder(clientState);
    localState = projectUpdateHasChildrenForTask(
      clientState,
      localState,
      newId
    );

    clientState = projectValidateCompletion(clientState);
    localState = projectGenerateVisibleOrder(clientState, localState);

    this.stateManager._update({ clientState, localState });
  };
}
