import GoalsUtil from './goals-util';

export default function filterGoal(goal, filter) {
  const helper = new GoalsUtil(goal);
  const isCompleted = helper.getIsCompleted();

  const milestoneId = filter.get('milestoneId');
  // Supported: none || milestone.id
  if (milestoneId) {
    if (milestoneId === 'none') {
      if (goal.get('milestoneId')) {
        return false;
      }
    } else if (goal.get('milestoneId') !== milestoneId) {
      return false;
    }
  }

  // Check goal types
  const goalType = filter.get('goalType');
  // Supported: current, upcoming, completed, starred
  if(goalType === 'completed' && !isCompleted){
    return false;
  }
  if (goalType && goalType !== 'completed' && isCompleted){
    return false;
  }
  if(goalType === 'starred' && !goal.get('starred')){
    return false;
  }

  // Check for assignees
  const userId = filter.get('userId');
  if (userId) {
    // Check all/completed goals for assignees filter
    if (!goalType || goalType === 'completed') {
      const allInvolved = helper.getAllInvolvedAssignees();
      const hasUser = (allInvolved.indexOf(userId) > -1);
      if (userId !== 'none' && userId && !hasUser) {
        return false;
      }
      if (userId === 'none' && allInvolved.size) {
        return false;
      }
    }
    // Check upcoming goals for assignees filter
    if(goalType === 'upcoming'){
      const currentAssignees = helper.getCurrentAssignees();
      const isCurrentlyAssigned = currentAssignees.find(uId => uId === userId);
      if (userId === 'none') {
        if (!helper.hasEmptyStepsLater()) {
          return false;
        }
      } else if(userId !== 'none') {
        if (isCurrentlyAssigned) {
          return false;
        }
        const remainingAssignees = helper.getRemainingAssignees();
        const isAssignedLater = remainingAssignees.find(uId => uId === userId);
        if (!isAssignedLater) {
          return false;
        }
      }
    }
    // Check current goals for assignees filter
    if (goalType === 'current') {
      const currentAssignees = helper.getCurrentAssignees();
      const isCurrentlyAssigned = currentAssignees.find(uId => uId === userId);
      if (!userId) {
        if (!currentAssignees.size) {
          return false;
        }
      } else if (userId === 'none') {
        if (currentAssignees.size && helper.getTotalNumberOfSteps()) {
          return false;
        }
      } else if (!isCurrentlyAssigned) {
        return false;
      }
    }
  }

  // Check for search matching filter
  let matching = filter.get('matching');
  if (matching && matching.length) {
    matching = matching.toLowerCase();
    let foundMatch = false;

    if (goal.get('title').toLowerCase().includes(matching)) {
      foundMatch = true;
    }
    goal.get('steps').forEach((s) => {
      if (s.get('title').toLowerCase().includes(matching)) {
        foundMatch = true;
      }
      return !foundMatch;
    });
    if (!foundMatch) {
      return false;
    }
  }
  return true;
}
