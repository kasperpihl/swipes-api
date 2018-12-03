export default (clientState, localState, id) => {
  const sortedOrder = clientState.get('sortedOrder');
  const i = clientState.getIn(['order', id]);
  const currId = sortedOrder.get(i);
  const prevId = sortedOrder.get(i - 1);
  const nextId = sortedOrder.get(i + 1);
  const currIndent = clientState.getIn(['indent', currId]);
  if (prevId) {
    const prevIndent = clientState.getIn(['indent', prevId]);
    const hasChildren = currIndent > prevIndent;
    if (hasChildren !== localState.getIn(['hasChildren', prevId])) {
      localState = localState.setIn(['hasChildren', prevId], hasChildren);
      // localState = localState.setIn(['expanded', prevId], hasChildren);
    }
  }
  const hasChildren = (clientState.getIn(['indent', nextId]) || 0) > currIndent;

  if (hasChildren !== clientState.getIn(['hasChildren', currId])) {
    localState = localState.setIn(['hasChildren', currId], hasChildren);
    // localState = localState.setIn(['expanded', currId], hasChildren);
  }
  return localState;
};
