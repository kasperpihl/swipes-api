export default (clientState, localState, id) => {
  const itemIndent = clientState.getIn(['indent', id]);
  const sortedOrder = clientState.get('sortedOrder');
  let parentId;
  let deltaI = clientState.getIn(['order', id]) - 1;

  while (typeof parentId === 'undefined' && deltaI >= 0) {
    const id = sortedOrder.get(deltaI);
    const indent = clientState.getIn(['indent', id]);
    if (indent < itemIndent) {
      parentId = id;
    }
    deltaI--;
  }
  if (parentId && !localState.getIn(['expanded', parentId])) {
    localState = localState.setIn(['expanded', parentId], true);
  }
  return localState;
};
