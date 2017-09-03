import r from 'rethinkdb';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  dbGoalsInsertSingle,
  dbGoalsUpdateSingle,
  dbGoalsGetSingle,
  dbGoalsCompleteGoal,
  dbGoalsIncompleteGoal,
  dbGoalsCompleteStep,
  dbGoalsIncompleteStep,
  dbGoalsAppendWayToGoal,
  dbGoalsAssign,
} from './db_utils/goals';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const goalsCreate = valLocals('goalsCreate', {
  user_id: string.require(),
  goal: object.as({
    title: string.min(1).require(),
    assignees: array.of(string).require(),
    step_order: array,
    steps: object,
  }),
  organization_id: string.require(),
  milestone_id: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    organization_id,
    milestone_id = null,
  } = res.locals;

  goal.id = generateSlackLikeId('G');
  goal.organization_id = organization_id;
  goal.created_at = new Date();
  goal.updated_at = new Date();
  goal.created_by = user_id;
  goal.archived = false;
  goal.history = [{
    type: 'goal_created',
    from: null,
    to: null,
    done_by: user_id,
    done_at: new Date(),
  }];
  goal.steps = goal.steps || {};
  goal.step_order = goal.step_order || [];
  goal.attachments = {};
  goal.attachment_order = [];
  goal.milestone_id = milestone_id;
  goal.completed_at = null;

  setLocals({
    goal,
  });

  return next();
});
const goalsCompleteGoal = valLocals('goalsCompleteGoal', {
  user_id: string.require(),
  goal_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
  } = res.locals;
  const type = 'goal_completed';
  const historyItem = {
    type,
    done_by: user_id,
    done_at: new Date(),
  };

  dbGoalsCompleteGoal({ goal_id, user_id, historyItem })
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        type,
        goal: changes.new_val,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsIncompleteGoal = valLocals('goalsIncompleteGoal', {
  user_id: string.require(),
  goal_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
  } = res.locals;
  const type = 'goal_incompleted';
  const historyItem = {
    type,
    done_by: user_id,
    done_at: new Date(),
  };

  dbGoalsIncompleteGoal({ goal_id, user_id, historyItem })
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        type,
        goal: changes.new_val,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsCompleteStep = valLocals('goalsCompleteStep', {
  goal_id: string.require(),
  step_id: string.require(),
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    goal_id,
    step_id,
    user_id,
  } = res.locals;
  const type = 'step_completed';

  return dbGoalsCompleteStep({
    goal_id,
    step_id,
    user_id,
    type,
  })
  .then((results) => {
    const changes = results.changes[0].new_val || results.changes[0].old_val;

    setLocals({
      goal: changes,
      type,
    });

    return next();
  })
  .catch((error) => {
    return next(error);
  });
});
const goalsIncompleteStep = valLocals('goalsIncompleteStep', {
  goal_id: string.require(),
  step_id: string.require(),
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    goal_id,
    step_id,
    user_id,
  } = res.locals;
  const type = 'step_incompleted';

  return dbGoalsIncompleteStep({
    goal_id,
    step_id,
    user_id,
    type,
  })
  .then((results) => {
    const changes = results.changes[0].new_val || results.changes[0].old_val;

    setLocals({
      goal: changes,
      type,
    });

    return next();
  })
  .catch((error) => {
    return next(error);
  });
});
const goalsInsert = valLocals('goalsInsert', {
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    goal,
  } = res.locals;

  dbGoalsInsertSingle({ goal })
    .then((obj) => {
      setLocals({
        goal: obj.changes[0].new_val,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsArchive = valLocals('goalsArchive', {
  user_id: string.require(),
  goal_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
  } = res.locals;
  const historyItem = {
    type: 'goal_archived',
    done_by: user_id,
    done_at: new Date(),
  };
  const properties = {
    archived: true,
    milestone_id: null,
    history: r.row('history').append(historyItem),
  };

  dbGoalsUpdateSingle({ goal_id, properties })
    .then((results) => {
      const changes = results.changes[0].old_val;

      setLocals({
        milestone_id: changes.milestone_id,
        eventType: 'goal_archived',
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsAddMilestone = valLocals('goalsAddMilestone', {
  goal_id: string.require(),
  milestone_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    goal_id,
    milestone_id,
  } = res.locals;
  const properties = {
    milestone_id,
  };

  dbGoalsUpdateSingle({ goal_id, properties })
    .then((results) => {
      setLocals({
        eventType: 'milestone_goal_added',
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsRemoveMilestone = valLocals('goalsRemoveMilestone', {
  goal_id: string.require(),
  milestone_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    goal_id,
  } = res.locals;
  const properties = {
    milestone_id: null,
  };

  dbGoalsUpdateSingle({ goal_id, properties })
    .then((results) => {
      setLocals({
        eventType: 'milestone_goal_removed',
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsGetSingle = valLocals('goalsGetSingle', {
  goal_id: string.require(),
}, (req, res, next) => {
  const {
    goal_id,
  } = res.locals;

  dbGoalsGetSingle({ goal_id })
    .then((goal) => {
      if (!goal) {
        return next(new SwipesError('goal not found'));
      }

      res.locals.goal = goal;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsCreateQueueMessage = valLocals('goalsCreateQueueMessage', {
  user_id: string.require(),
  goal: object.require(),
  goal_order: array,
  milestone_id: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    goal_order = [],
    milestone_id = null,
  } = res.locals;
  const goal_id = goal.id;
  const queueMessage = {
    user_id,
    goal_id,
    milestone_id,
    goal_order,
    event_type: 'goal_created',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsArchiveQueueMessage = valLocals('goalsArchiveQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  eventType: string.require(),
  milestone_id: string,
  goal_order: array,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    eventType,
    milestone_id,
    goal_order = [],
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    event_type: eventType,
    milestone_id,
    goal_order,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsCompleteStepQueueMessage = valLocals('goalsCompleteStepQueueMessage', {
  user_id: string.require(),
  goal: object.as({
    id: string.require(),
  }).require(),
  type: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    type,
  } = res.locals;
  const goal_id = goal.id;

  const queueMessage = {
    user_id,
    goal_id,
    event_type: type,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsCompleteQueueMessage = valLocals('goalsCompleteQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  type: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    type,
  } = res.locals;

  const queueMessage = {
    user_id,
    goal_id,
    event_type: type,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsIncompleteQueueMessage = valLocals('goalsIncompleteQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  type: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    type,
  } = res.locals;

  const queueMessage = {
    user_id,
    goal_id,
    event_type: type,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsIncompleteStepQueueMessage = valLocals('goalsIncompleteStepQueueMessage', {
  user_id: string.require(),
  goal: object.as({
    id: string.require(),
  }).require(),
  type: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    type,
  } = res.locals;
  const goal_id = goal.id;

  const queueMessage = {
    user_id,
    goal_id,
    event_type: type,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsRename = valLocals('goalsRename', {
  goal_id: string.require(),
  title: string.min(1).require(),
}, (req, res, next, setLocals) => {
  const {
    goal_id,
    title,
  } = res.locals;
  const properties = {
    title,
  };

  dbGoalsUpdateSingle({ goal_id, properties })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsRenameQueueMessage = valLocals('goalsRenameQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  title: string.min(1).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    title,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    title,
    event_type: 'goal_renamed',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsAppendWayToGoal = valLocals('goalsAppendWayToGoal', {
  goal_id: string.require(),
  way: object.require(),
}, (req, res, next, setLocals) => {
  const {
    goal_id,
    way,
  } = res.locals;
  const { goal } = way;
  const {
    steps,
    step_order,
    attachments,
    attachment_order,
  } = goal;

  dbGoalsAppendWayToGoal({ goal_id, steps, step_order, attachments, attachment_order })
    .then((results) => {
      const changes = results.changes[0];
      const goal = changes.new_val || changes.old_val;

      setLocals({
        goal,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsAppendWayToGoalQueueMessage = valLocals('goalsAppendWayToGoalQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    event_type: 'goal_loaded_way',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsAssign = valLocals('goalsAssign', {
  user_id: string.require(),
  goal_id: string.require(),
  assignees: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    assignees,
  } = res.locals;

  dbGoalsAssign({ user_id, goal_id, assignees })
    .then((result) => {
      const newVal = result.changes[0].new_val;
      const oldVal = result.changes[0].old_val;
      const newStepAssignees = newVal.assignees;
      const oldStepAssignees = oldVal.assignees;
      const diffAssignees = newStepAssignees.filter(a => !oldStepAssignees.find(b => b === a));

      setLocals({
        steps: newVal.steps,
        assignees_diff: diffAssignees,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsAssignQueueMessage = valLocals('goalsAssignQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  assignees: array.of(string).require(),
  assignees_diff: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    assignees,
    assignees_diff,
  } = res.locals;
  const event_type = 'goal_assigned';
  const queueMessage = {
    user_id,
    goal_id,
    assignees,
    assignees_diff,
    event_type,
    notification_id_sufix: `${goal_id}-${event_type}`,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});

export {
  goalsCreate,
  goalsInsert,
  goalsArchive,
  goalsAddMilestone,
  goalsRemoveMilestone,
  goalsGetSingle,
  goalsCreateQueueMessage,
  goalsArchiveQueueMessage,
  goalsCompleteStepQueueMessage,
  goalsIncompleteStepQueueMessage,
  goalsCompleteStep,
  goalsIncompleteStep,
  goalsRename,
  goalsRenameQueueMessage,
  goalsAppendWayToGoal,
  goalsAppendWayToGoalQueueMessage,
  goalsCompleteGoal,
  goalsCompleteQueueMessage,
  goalsIncompleteGoal,
  goalsIncompleteQueueMessage,
  goalsAssign,
  goalsAssignQueueMessage,
};
