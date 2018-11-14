export default (order, indexToComplete, shouldComplete) => {
  const completionStamp = new Date();
  const orgIndent = order.getIn([indexToComplete, 'indent']);
  let deltaIndex = indexToComplete;
  let deltaIndent = order.getIn([indexToComplete, 'indent']);
  let newOrder = order;
  do {
    // Set all children and grandchildren
    newOrder = newOrder.setIn([deltaIndex, 'completed'], shouldComplete);
    deltaIndex++;
    deltaIndent = order.getIn([deltaIndex, 'indent']);
  } while (deltaIndent > orgIndent && deltaIndex < order.size);

  // Verify
  const allCompletedForLevel = {};
  let currentIndent = -1;
  let nextI = newOrder.size - 1;
  while (nextI >= 0) {
    const indent = newOrder.getIn([nextI, 'indent']);
    const completed = !!newOrder.getIn([nextI, 'completed']);
    const key = '' + indent; // Make sure key is a string

    // set the allCompleted for this level, if it does not exist.
    if (typeof allCompletedForLevel[key] === 'undefined') {
      allCompletedForLevel[key] = !!completed;
    }

    // If we hit a lower indention
    if (indent < currentIndent) {
      const childLevelKey = `${indent + 1}`; // Make sure key is a string

      // check if all of it's children are completed or incomplete
      const childCompleted = allCompletedForLevel[childLevelKey];

      // assign child value to the parent element if needed.
      if (childCompleted !== completed) {
        newOrder = newOrder.setIn([nextI, 'completed'], childCompleted);
        completed = childCompleted;
      }

      // Clean child level status, we won't need it now.
      delete allCompletedForLevel[childLevelKey];
    }

    // Keep tracking if this level is all completed.
    if (allCompletedForLevel[key] && !completed) {
      allCompletedForLevel[key] = false;
    }

    // Make sure to update indent level
    currentIndent = indent;
    nextI--;
  }

  console.log('____TESTING____');
  newOrder.forEach((o, i) => {
    let indentChar = '';
    for (let i = 0; i < o.get('indent'); i++) indentChar += '  ';
    console.log(`-${i}-`, indentChar, o.get('completed'));
  });
  return newOrder;
};
