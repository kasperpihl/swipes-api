export default (order, idOrI, modifier) => {
  modifier = modifier || 0;

  let i =
    typeof idOrI === 'number'
      ? idOrI
      : order.findIndex(item => item.get('id') === idOrI);
  const newIndent = order.getIn([i, 'indent']) + modifier;
  if (
    (i === 0 && modifier !== 0) ||
    newIndent < 0 ||
    newIndent > order.getIn([i - 1, 'indent']) + 1
  ) {
    return order;
  }
  order = order.setIn([i, 'indent'], newIndent);

  if (modifier <= 0) {
    let foundNextSiblingOrLess = false;
    while (!foundNextSiblingOrLess) {
      const prevIndent = order.getIn([i, 'indent']);
      i++;
      const item = order.get(i);
      if (!item || item.get('indent') <= newIndent) {
        foundNextSiblingOrLess = true;
      } else {
        const targetIndent = order.getIn([i, 'indent']) + modifier;
        order = order.setIn(
          [i, 'indent'],
          Math.min(prevIndent + 1, targetIndent)
        );
      }
    }
  }

  return order;
};
