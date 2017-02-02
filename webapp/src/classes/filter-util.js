import GoalsUtil from 'classes/goals-util';

export function getGoalTypeForValue(goalType) {
  const goalTypes = {
    current: 'current goals',
    upcoming: 'upcoming goals',
    completed: 'completed goals',
  };
  return goalTypes[goalType] || 'any goals';
}

export function getUserStringForValue(users, userId) {
  if (userId === 'none') {
    return 'no one';
  }
  if (users) {
    const user = users.get(userId);
    if (user) {
      return user.get('name').split(' ')[0].toLowerCase();
    }
  }

  return 'anyone';
}

export function getMilestoneStringForValue(milestones, milestoneId) {
  if (milestoneId === 'none') {
    return 'without milestone';
  }
  if (milestones) {
    const milestone = milestones.get(milestoneId);
    if (milestone) {
      return milestone.get('title');
    }
  }

  return 'any milestone';
}

export function filterGoals(goals, type, userId, milestoneId) {
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
    if (type === 'completed' && helper.getCurrentStep()) {
      return false;
    }
    if (userId && userId !== 'any') {
      if (type === 'all' || type === 'completed') {
        const allInvolved = helper.getAllInvolvedAssignees();
        const hasUser = (allInvolved.indexOf(userId) > -1);
        if (userId !== 'none' && !hasUser) {
          return false;
        }
        if (userId === 'none' && allInvolved.size) {
          return false;
        }
      } else if (type === 'upcoming' || type === 'current') {
        const currentAssignees = helper.getCurrentAssignees();
        if (currentAssignees === false) {
          return false; // goal is completed
        }
        const isCurrentlyAssigned = currentAssignees.find(uId => uId === userId);
        if (type === 'current') {
          console.log(userId);
          if (userId === 'any') {
            console.log('currentAssignees', currentAssignees.size);
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
    return true;
  });
}
