import { fromJS } from 'immutable';
export default clientState => {
  let localState = fromJS({
    hasChildren: {},
    selectedIndex: -1,
    sliderValue: 0,
    expanded: {}
  });

  clientState.get('sortedOrder').forEach((taskId, i) => {
    const indent = clientState.getIn(['indent', taskId]);

    const nextIndent =
      clientState.getIn([
        'indent',
        clientState.getIn(['sortedOrder', i + 1])
      ]) || -1;

    localState = localState.setIn(['hasChildren', taskId], indent < nextIndent);
    localState = localState.setIn(['expanded', taskId], false);
  });

  let blockIndentMoreThan = -1;
  localState = localState.set(
    'visibleOrder',
    clientState.get('sortedOrder').filter((taskId, i) => {
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
    })
  );
  return localState;
};
