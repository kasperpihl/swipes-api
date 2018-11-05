export default (order, i) => {
  const indent = order.getIn([i, 'indent']);
  const parentI = order.findLastIndex(
    (val, key) => key < i && val.get('indent') < indent
  );
  if (parentI > -1 && !order.getIn([parentI, 'expanded'])) {
    order = order.setIn([parentI, 'expanded'], true);
  }
  return order;
};
