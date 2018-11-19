export default order => {
  // Verify
  const allCompletedForLevel = {};
  let currentIndent = -1;
  for (let index = order.size - 1; index >= 0; index--) {
    const indent = order.getIn([index, 'indent']);
    const completed = !!order.getIn([index, 'completion']);
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
        order = order.setIn([index, 'completion'], childCompleted);
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
  }

  return order;
};
