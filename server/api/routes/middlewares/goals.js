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
  dbGoalsPushToHistorySingle,
} from './db_utils/goals';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';
import {
  goalMoreStrict,
} from '../../validators';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const goalsCreate = valLocals('goalsCreate', {
  user_id: string.require(),
  goal: goalMoreStrict,
  organization_id: string.require(),
  message: string,
  flags: array.of(string),
}, (req, res, next) => {
  const {
    user_id,
    goal,
    organization_id,
    message,
    flags = [],
  } = res.locals;
  const goalId = generateSlackLikeId('G');
  const currentStepId = goal.step_order[0];

  goal.id = goalId;
  goal.organization_id = organization_id;
  goal.created_at = r.now();
  goal.updated_at = r.now();
  goal.created_by = user_id;
  goal.archived = false;
  goal.history = [{
    flags,
    message,
    type: 'created',
    from: null,
    to: currentStepId,
    done_by: user_id,
    done_at: r.now(),
  }];
  goal.status = {
    flags,
    current_step_id: currentStepId,
    prev_step_id: null,
    handoff_message: message,
    handoff_by: user_id,
    handoff_at: r.now(),
  };

  return next();
});

const goalsCompleteStep = valLocals('goalsCompleteStep', {
  goal: object.as({
    status: object.require(),
    steps: object.require(),
    history: array.of(object).require(),
  }).require(),
  goal_id: string.require(),
  current_step_id: string.require(),
  next_step_id: string,
  message: string,
  flags: array.of(string),
  assignees: array.of(string),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    current_step_id,
    next_step_id,
    message,
    flags = [],
    assignees = null,
  } = res.locals;

  if (goal.status.current_step_id !== current_step_id) {
    return next(new SwipesError('Invalid current_step_id'));
  }

  if (next_step_id && !goal.steps[next_step_id]) {
    return next(new SwipesError('Invalid next_step_id'));
  }

  const type = next_step_id ? 'complete_step' : 'complete_goal';
  const currentStep = goal.steps[current_step_id];
  const history = {
    type,
    flags,
    message,
    done_by: user_id,
    from: current_step_id,
    to: next_step_id,
    done_at: r.now(),
    assignees: currentStep.assignees || [],
  };

  if (assignees && next_step_id) {
    goal.steps[next_step_id].assignees = assignees;
  }

  goal.history.push(history);
  goal.status = {
    flags,
    current_step_id: next_step_id,
    handoff_at: r.now(),
    handoff_by: user_id,
    handoff_message: message,
    prev_step_id: current_step_id,
  };

  setLocals({
    goal,
  });

  return next();
});
const goalsProgressStatus = valLocals('goalsArchive', {
  goal: object.as({
    status: object.require(),
    steps: object.require(),
    history: array.of(object).require(),
  }).require(),
  current_step_id: string.require(),
  next_step_id: string,
}, (req, res, next, setLocals) => {
  const {
    goal,
    current_step_id,
    next_step_id,
  } = res.locals;

  const currentStepPosision = goal.step_order.indexOf(current_step_id);
  const nextStepPosision = goal.step_order.indexOf(next_step_id);
  let goalProgress = 'forward';

  if (currentStepPosision === nextStepPosision) {
    goalProgress = 'reassign';
  }

  if (nextStepPosision < currentStepPosision) {
    goalProgress = 'iteration';
  }

  setLocals({
    goalProgress,
  });

  return next();
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
        eventType: 'goal_created',
        data: obj.changes[0].new_val,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsArchive = valLocals('goalsArchive', {
  goal_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    goal_id,
  } = res.locals;
  const properties = { archived: true };

  dbGoalsUpdateSingle({ goal_id, properties })
    .then(() => {
      setLocals({
        eventType: 'goal_archived',
        id: goal_id,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsAddMilestone = valLocals('goalsAddMilestone', {
  id: string.require(),
  milestone_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    id,
    milestone_id,
  } = res.locals;
  const properties = { milestone_id };

  dbGoalsUpdateSingle({ goal_id: id, properties })
    .then(() => {
      setLocals({
        eventType: 'goal_milestone_added',
        id,
        milestone_id,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsRemoveMilestone = valLocals('goalsRemoveMilestone', {
  id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    id,
  } = res.locals;
  const properties = { milestone_id: null };

  dbGoalsUpdateSingle({ goal_id: id, properties })
    .then(() => {
      setLocals({
        eventType: 'goal_milestone_removed',
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsGet = valLocals('goalsGet', {
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
const goalsUpdate = valLocals('goalsUpdate', {
  goal_id: string.require(),
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    goal_id,
    goal,
  } = res.locals;

  dbGoalsUpdateSingle({ goal_id, properties: goal })
    .then(() => {
      setLocals({
        eventType: 'goal_updated',
        eventData: goal,
        goal,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsCreateQueueMessage = valLocals('goalsCreateQueueMessage', {
  user_id: string.require(),
  goal: object.as({
    id: string.require(),
  }).require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    eventType,
  } = res.locals;
  const goal_id = goal.id;
  const queueMessage = {
    user_id,
    goal_id,
    event_type: eventType,
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
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsAddMilestoneQueueMessage = valLocals('goalsAddMilestoneQueueMessage', {
  user_id: string.require(),
  id: string.require(),
  milestone_id: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    id,
    milestone_id,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    milestone_id,
    goal_id: id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: id,
  });

  return next();
});
const goalsRemoveMilestoneQueueMessage = valLocals('goalsRemoveMilestoneQueueMessage', {
  user_id: string.require(),
  id: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    id,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id: id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: id,
  });

  return next();
});
const goalsNextStepQueueMessage = valLocals('goalsNextStepQueueMessage', {
  user_id: string.require(),
  goal: object.as({
    id: string.require(),
  }).require(),
  current_step_id: string.require(),
  goalProgress: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    current_step_id,
    next_step_id,
    goalProgress,
  } = res.locals;
  const goal_id = goal.id;
  const event_type = next_step_id ? 'step_completed' : 'goal_completed';
  const queueMessage = {
    user_id,
    goal_id,
    event_type,
    next_step_id,
    step_id: current_step_id,
    progress: goalProgress,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsNotify = valLocals('goalsNotify', {
  user_id: string.require(),
  goal_id: string.require(),
  current_step_id: string.require(),
  assignees: array.of(string).require(),
  flags: array.of(string),
  message: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    assignees,
    current_step_id,
    flags = [],
    message = '',
  } = res.locals;

  const historyItem = [{
    flags,
    message,
    assignees,
    type: 'notified',
    from: null,
    to: current_step_id,
    done_by: user_id,
    done_at: r.now(),
  }];

  dbGoalsPushToHistorySingle({ goal_id, historyItem })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsNotifyQueueMessage = valLocals('goalsNotifyQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  assignees: array.of(string).require(),
  flags: array.of(string),
  message: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    assignees,
    flags = [],
    message = '',
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    flags,
    message,
    user_ids: assignees,
    event_type: 'goal_notify',
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
  goalsGet,
  goalsUpdate,
  goalsCreateQueueMessage,
  goalsArchiveQueueMessage,
  goalsNextStepQueueMessage,
  goalsAddMilestoneQueueMessage,
  goalsRemoveMilestoneQueueMessage,
  goalsCompleteStep,
  goalsProgressStatus,
  goalsNotifyQueueMessage,
  goalsNotify,
};
