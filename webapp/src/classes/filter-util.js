import GoalsUtil from 'classes/goals-util';

export default function filterGoals(goals, type, userId, milestoneId, matching) {
  return goals.filter((goal) => {
    const helper = new GoalsUtil(goal);
    if (milestoneId && milestoneId !== 'any') {
      if (milestoneId === 'none') {
        if (goal.get('milestoneId')) {
          return false;
        }
      } else if (goal.get('milestoneId') !== milestoneId) {
        return false;
      }
    }
    if (type === 'unstarted' && (helper.getIsStarted() || helper.getIsCompleted())) {
      return false;
    }
    if (type !== 'unstarted' && !helper.getIsStarted()) {
      return false;
    }
    if (type === 'completed' && helper.getCurrentStep()) {
      return false;
    }
    if (userId) {
      if (type === 'all' || type === 'completed') {
        const allInvolved = helper.getAllInvolvedAssignees();
        const hasUser = (allInvolved.indexOf(userId) > -1);
        if (userId !== 'none' && userId !== 'any' && !hasUser) {
          return false;
        }
        if (userId === 'none' && allInvolved.size) {
          return false;
        }
      } else if (type === 'upcoming' || type === 'current') {
        const currentAssignees = helper.getCurrentAssignees();
        if (helper.getIsCompleted()) {
          return false; // goal is completed
        }
        const isCurrentlyAssigned = currentAssignees.find(uId => uId === userId);
        if (type === 'current') {
          if (userId === 'any') {
            if (!currentAssignees.size) {
              return false;
            }
          } else if (userId === 'none') {
            if (currentAssignees.size) {
              return false;
            }
          } else if (!isCurrentlyAssigned) {
            return false;
          }
        } else if (type === 'upcoming') {
          if (userId === 'none') {
            if (!helper.hasEmptyStepsLater()) {
              return false;
            }
          } else {
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
      }
    }
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
  });
}
