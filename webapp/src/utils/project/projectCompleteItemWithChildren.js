export default (order, indexToComplete, shouldComplete) => {
  const orgIndent = order.getIn([indexToComplete, 'indent']);
  let deltaIndex = indexToComplete;
  let deltaIndent = order.getIn([indexToComplete, 'indent']);
  let newOrder = order;
  do {
    // Set all children and grandchildren
    newOrder = newOrder.setIn([deltaIndex, 'completed'], !!shouldComplete);
    deltaIndex++;
    deltaIndent = order.getIn([deltaIndex, 'indent']);
  } while (deltaIndent > orgIndent && deltaIndex < order.size);

  return newOrder;
};
