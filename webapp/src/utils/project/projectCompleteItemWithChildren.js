export default (clientState, idToComplete, shouldComplete) => {
  const indexToComplete = clientState.getIn(['order', idToComplete]);
  const orgIndent = clientState.getIn(['indent', idToComplete]);

  let deltaIndex = indexToComplete;
  let deltaIndent = orgIndent;
  let newClientState = clientState;
  do {
    // Set all children and grandchildren
    const deltaId = clientState.getIn(['sortedOrder', deltaIndex]);
    newClientState = newClientState.setIn(
      ['completion', deltaId],
      !!shouldComplete
    );
    deltaIndex++;
    deltaIndent = newClientState.getIn(['indent', deltaId]);
  } while (
    deltaIndent > orgIndent &&
    deltaIndex < newClientState.get('sorderOrder').size
  );

  return newClientState;
};
