export default (order, i) => {
  const curr = order.get(i);
  const prev = order.get(i - 1);
  const next = order.get(i + 1);
  if (prev) {
    const hasChildren = curr.get('indent') > prev.get('indent');
    if (hasChildren !== prev.get('hasChildren')) {
      order = order
        .setIn([i - 1, 'hasChildren'], hasChildren)
        .setIn([i - 1, 'expanded'], !!hasChildren);
    }
  }
  let hasChildren = false;
  if (next) {
    hasChildren = next.get('indent') > curr.get('indent');
  }
  if (hasChildren !== curr.get('hasChildren')) {
    order = order
      .setIn([i, 'hasChildren'], hasChildren)
      .setIn([i, 'expanded'], !!hasChildren);
  }
  return order;
};
