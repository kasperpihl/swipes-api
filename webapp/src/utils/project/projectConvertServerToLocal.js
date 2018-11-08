import { List, Map } from 'immutable';

export default server => {
  let order = List();
  let itemsById = server.get('itemsById');
  const sortedOrder = server.getIn(['project', 'order']).sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });

  let lastIndent;
  sortedOrder.forEach((i, itemId) => {
    const indent = server.getIn(['project', 'indent', itemId]);
    if (typeof lastIndent !== 'undefined' && indent > lastIndent) {
      order = order.setIn([order.size - 1, 'hasChildren'], true);
    }
    lastIndent = indent;
    order = order.push(
      Map({
        id: itemId,
        indent,
        hasChildren: false,
        expanded: false,
        completed: server.getIn(['project', 'completion', itemId]) || null
      })
    );
  });
  return [order, itemsById];
};
