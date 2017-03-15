import r from 'rethinkdb';
import {
  string,
  object,
  array,
  bool,
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
  SwipesError,
} from '../../../middlewares/swipes-error';

const goalsCreate = valLocals('goalsCreate', {
  user_id: string.require(),
  goal: object.as({
    title: string.min(1).require(),
  }),
  organization_id: string.require(),
}, (req, res, next) => {
  const {
    user_id,
    goal,
    organization_id,
  } = res.locals;

  goal.id = generateSlackLikeId('G');
  goal.organization_id = organization_id;
  goal.created_at = r.now();
  goal.updated_at = r.now();
  goal.created_by = user_id;
  goal.archived = false;
  goal.history = [{
    type: 'goal_created',
    from: null,
    to: null,
    done_by: user_id,
    done_at: r.now(),
  }];
  goal.steps = {};
  goal.step_order = [];
  goal.attachments = {};
  goal.attachment_order = [];

  goal.status = {
    current_step_id: null,
  };

  return next();
});
const goalsCompleteStep = valLocals('goalsCompleteStep', {
  goal: object.as({
    status: object.require(),
    steps: object.require(),
    history: array.of(object).require(),
  }).require(),
  notificationGroupId: string.require(),
  goalProgress: string.require(),
  current_step_id: string,
  next_step_id: string,
  message: string,
  flags: array.of(string),
  assignees: array.of(string),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    notificationGroupId,
    goalProgress,
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

  const type = next_step_id ? 'step_completed' : 'goal_completed';
  const currentStep = goal.steps[current_step_id] || {};
  const history = {
    type,
    flags,
    message,
    done_by: user_id,
    from: current_step_id,
    to: next_step_id,
    done_at: r.now(),
    group_id: notificationGroupId,
    assignees: currentStep.assignees || [],
    progress: goalProgress,
  };

  if (assignees && next_step_id) {
    goal.steps[next_step_id].assignees = assignees;
  }

  goal.history.push(history);
  goal.status = {
    current_step_id: next_step_id,
    completed: type === 'goal_completed',
  };

  setLocals({
    goal,
  });

  return next();
});
const goalsProgressStatus = valLocals('goalsProgressStatus', {
  goal: object.as({
    step_order: array.require(),
  }).require(),
  current_step_id: string,
  next_step_id: string,
}, (req, res, next, setLocals) => {
  const {
    goal,
    current_step_id,
    next_step_id,
  } = res.locals;

  let currentStepPosition = goal.step_order.indexOf(current_step_id);

  if (currentStepPosition === -1) {
    currentStepPosition = goal.step_order.length;
  }

  const nextStepPosition = goal.step_order.indexOf(next_step_id);
  let goalProgress = 'forward';

  if (currentStepPosition === nextStepPosition) {
    goalProgress = 'reassign';
  }

  if (nextStepPosition !== null && nextStepPosition < currentStepPosition) {
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
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    notificationGroupId,
  } = res.locals;
  const historyItem = {
    type: 'goal_archived',
    done_by: user_id,
    done_at: r.now(),
    group_id: notificationGroupId,
  };
  const properties = {
    archived: true,
    history: r.row('history').append(historyItem),
  };

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
  user_id: string.require(),
  id: string.require(),
  milestone_id: string.require(),
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    id,
    milestone_id,
    notificationGroupId,
  } = res.locals;
  const historyItem = {
    milestone_id,
    type: 'goal_milestone_added',
    done_by: user_id,
    done_at: r.now(),
    group_id: notificationGroupId,
  };
  const properties = {
    milestone_id,
    history: r.row('history').append(historyItem),
  };

  dbGoalsUpdateSingle({ goal_id: id, properties })
    .then(() => {
      setLocals({
        eventType: 'goal_milestone_added',
        id,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsRemoveMilestone = valLocals('goalsRemoveMilestone', {
  user_id: string.require(),
  id: string.require(),
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    id,
    notificationGroupId,
  } = res.locals;
  const historyItem = {
    type: 'goal_milestone_removed',
    done_by: user_id,
    done_at: r.now(),
    group_id: notificationGroupId,
  };
  const properties = {
    milestone_id: null,
    history: r.row('history').append(historyItem),
  };

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
  goal: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
  } = res.locals;
  const goal_id = goal.id;
  const queueMessage = {
    user_id,
    goal_id,
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
  notificationGroupId: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    notificationGroupId,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    group_id: notificationGroupId,
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
  eventType: string.require(),
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    id,
    notificationGroupId,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id: id,
    group_id: notificationGroupId,
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
  notificationGroupId: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    id,
    notificationGroupId,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id: id,
    group_id: notificationGroupId,
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
  next_step_id: string,
  goalProgress: string.require(),
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    next_step_id,
    notificationGroupId,
  } = res.locals;
  const goal_id = goal.id;
  const event_type = next_step_id ? 'step_completed' : 'goal_completed';
  const queueMessage = {
    user_id,
    goal_id,
    next_step_id,
    group_id: notificationGroupId,
    event_type,
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
  current_step_id: string,
  assignees: array.of(string).require(),
  feedback: bool,
  flags: array.of(string),
  message: string,
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    assignees,
    current_step_id,
    feedback,
    notificationGroupId,
    flags = [],
    message = '',
  } = res.locals;

  const historyItem = {
    flags,
    message,
    assignees,
    feedback,
    type: 'goal_notify',
    from: null,
    to: current_step_id,
    done_by: user_id,
    done_at: r.now(),
    group_id: notificationGroupId,
  };

  dbGoalsPushToHistorySingle({ goal_id, historyItem })
    .then((results) => {
      const goal = results.changes[0].new_val;

      setLocals({
        goal,
      });

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
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    assignees,
    notificationGroupId,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    user_ids: assignees,
    group_id: notificationGroupId,
    event_type: 'goal_notify',
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
  goalsRename,
  goalsRenameQueueMessage,
};
