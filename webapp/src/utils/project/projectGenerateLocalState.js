import { fromJS } from 'immutable';
import projectGenerateVisibleOrder from './projectGenerateVisibleOrder';

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

  localState = localState.set(
    'visibleOrder',
    projectGenerateVisibleOrder(clientState, localState)
  );
  return localState;
};
