export default (clientState, localState) => {
  let blockIndentMoreThan = -1;

  return clientState.get('sortedOrder').filter((taskId, i) => {
    const indent = clientState.getIn(['indent', taskId]);
    if (blockIndentMoreThan > -1 && indent > blockIndentMoreThan) {
      return false;
    }
    if (blockIndentMoreThan > -1 && indent <= blockIndentMoreThan) {
      blockIndentMoreThan = -1;
    }
    if (
      localState.getIn(['hasChildren', taskId]) &&
      !localState.getIn(['expanded', taskId])
    ) {
      blockIndentMoreThan = indent;
    }
    return true;
  });
};
