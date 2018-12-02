export default (clientState, id, modifier = 0) => {
  const originalIndent = clientState.getIn(['indent', id]);
  const index = clientState.getIn(['order', id]);
  const prevId = clientState.getIn(['sortedOrder', index - 1]);
  const maxIndent = prevId ? clientState.getIn(['indent', prevId]) + 1 : 0;
  const newIndent = originalIndent + modifier;
  if (newIndent > maxIndent || newIndent < 0) {
    return clientState;
  }
  clientState = clientState.setIn(['indent', id], newIndent);

  let foundNextSiblingOrLess = false;
  let i = index;
  while (!foundNextSiblingOrLess) {
    const prevIndent = clientState.getIn([
      'indent',
      clientState.getIn(['sortedOrder', i])
    ]);

    i++;
    const currId = clientState.getIn(['sortedOrder', i]);
    const currIndent = clientState.getIn(['indent', currId]);
    console.log(i, currIndent, typeof currIndent);
    if (typeof currIndent === 'undefined' || currIndent <= originalIndent) {
      foundNextSiblingOrLess = true;
    } else {
      const targetIndent = Math.min(prevIndent + 1, currIndent + modifier);
      if (currIndent !== targetIndent) {
        clientState = clientState.setIn(['indent', currId], targetIndent);
      }
    }
  }

  return clientState;
};
