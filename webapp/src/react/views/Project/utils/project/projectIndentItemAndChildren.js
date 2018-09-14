export default (order, i, modifier) => {
  modifier = modifier || 0;

  const originalIndent = order.getIn([i, 'indent']);
  const newIndent = originalIndent + modifier;
  if (
    (i === 0 && modifier !== 0) ||
    newIndent < 0 ||
    newIndent > order.getIn([i - 1, 'indent']) + 1
  ) {
    return order;
  }
  order = order.setIn([i, 'indent'], newIndent);

  let foundNextSiblingOrLess = false;
  while (!foundNextSiblingOrLess) {
    const prevIndent = order.getIn([i, 'indent']);
    i++;
    const item = order.get(i);
    if (!item || item.get('indent') <= originalIndent) {
      foundNextSiblingOrLess = true;
    } else {
      const targetIndent = order.getIn([i, 'indent']) + modifier;
      order = order.setIn(
        [i, 'indent'],
        Math.min(prevIndent + 1, targetIndent)
      );
    }
  }

  return order;
};
