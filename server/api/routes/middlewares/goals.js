import {
  string,
  object,
  array,
  any,
  bool,
  number,
  date,
} from 'valjs';
import {
  dbGoalsInsertSingle,
  dbGoalsUpdateSingle,
  dbGoalsGetSingle,
  dbGoalsPushToHistorySingle,
  dbGoalsRepliesHistoryUpdate,
  dbGoalsCompleteGoal,
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
  goal.steps = {};
  goal.step_order = [];
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
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    notificationGroupId,
  } = res.locals;
  const type = 'goal_completed';
  const historyItem = {
    type,
    done_by: user_id,
    done_at: new Date(),
    group_id: notificationGroupId,
  };

  dbGoalsCompleteGoal({ goal_id, user_id, historyItem })
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        goal: changes.new_val,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const goalsFindCompleteStatus = valLocals('goalsFindCompleteStatus', {
  goal: object.as({
    steps: object.require(),
  }).require(),
  step_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    goal,
    step_id,
  } = res.locals;
  const path = req.path;
  let goalCompletedAt = goal.completed_at || new Date();

  if (path.indexOf('incompleteStep') > 0) {
    goalCompletedAt = null;
  } else {
    goal.step_order.forEach((stepId) => {
      const step = goal.steps[stepId];

      if (step.id !== step_id && step.completed_at === null) {
        goalCompletedAt = null;
      }
    });
  }

  setLocals({
    goalCompletedAt,
  });

  return next();
});
const goalsCompleteStep = valLocals('goalsCompleteStep', {
  goal: object.as({
    steps: object.require(),
    history: array.of(object).require(),
  }).require(),
  notificationGroupId: string.require(),
  step_id: string.require(),
  goalCompletedAt: date.acceptNull().require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    notificationGroupId,
    step_id,
    goalCompletedAt,
  } = res.locals;

  if (!goal.steps[step_id]) {
    return next(new SwipesError('Invalid step_id'));
  }

  const type = 'step_completed';
  const currentStep = goal.steps[step_id];
  const history = {
    type,
    step_id,
    done_by: user_id,
    done_at: new Date(),
    group_id: notificationGroupId,
    assignees: currentStep.assignees || [],
  };

  currentStep.completed_at = currentStep.completed_at || new Date();
  goal.completed_at = goalCompletedAt;
  goal.history.push(history);

  setLocals({
    goal,
    type,
  });

  return next();
});
const goalsIncompleteStep = valLocals('goalsIncompleteStep', {
  goal: object.as({
    steps: object.require(),
    history: array.of(object).require(),
  }).require(),
  notificationGroupId: string.require(),
  step_id: string.require(),
  goalCompletedAt: date.acceptNull().require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    notificationGroupId,
    step_id,
    goalCompletedAt,
  } = res.locals;

  if (!goal.steps[step_id]) {
    return next(new SwipesError('Invalid step_id'));
  }

  const type = 'step_incompleted';
  const currentStep = goal.steps[step_id];
  const history = {
    type,
    step_id,
    done_by: user_id,
    done_at: new Date(),
    group_id: notificationGroupId,
    assignees: currentStep.assignees || [],
  };

  currentStep.completed_at = null;
  goal.completed_at = goalCompletedAt;
  goal.history.push(history);

  setLocals({
    goal,
    type,
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
    done_at: new Date(),
    group_id: notificationGroupId,
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
  notificationGroupId: string.require(),
  eventType: string.require(),
  milestone_id: string,
  goal_order: array,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    notificationGroupId,
    eventType,
    milestone_id,
    goal_order = [],
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    group_id: notificationGroupId,
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
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    notificationGroupId,
  } = res.locals;
  const goal_id = goal.id;

  const queueMessage = {
    user_id,
    goal_id,
    group_id: notificationGroupId,
    event_type: 'step_completed',
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
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    notificationGroupId,
  } = res.locals;

  const queueMessage = {
    user_id,
    goal_id,
    group_id: notificationGroupId,
    event_type: 'goal_completed',
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
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal,
    notificationGroupId,
  } = res.locals;
  const goal_id = goal.id;

  const queueMessage = {
    user_id,
    goal_id,
    group_id: notificationGroupId,
    event_type: 'step_incompleted',
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
  assignees: array.of(string).require(),
  flags: array.of(string),
  message: string,
  notificationGroupId: string.require(),
  notification_type: any.of('feedback', 'update', 'assets', 'decision', 'default'),
  request: bool,
  reply_to: number,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    assignees,
    notificationGroupId,
    flags = [],
    message = '',
    notification_type = 'default',
    request = false,
    reply_to = null,
  } = res.locals;

  const historyItem = {
    flags,
    message,
    assignees,
    notification_type,
    request,
    reply_to,
    type: 'goal_notify',
    from: null,
    to: null,
    done_by: user_id,
    done_at: new Date(),
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
  notification_type: any.of('feedback', 'update', 'assets', 'decision', 'default'),
  reply_to: number,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    assignees,
    notificationGroupId,
    notification_type,
    reply_to = null,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    notification_type,
    reply_to,
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
const goalsNotifyEmailQueueMessage = valLocals('goalsNotifyEmailQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  assignees: array.of(string).require(),
  notification_type: any.of('feedback', 'update', 'assets', 'decision', 'default'),
  notificationGroupId: string.require(),
  reply_to: number,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    assignees,
    notification_type,
    notificationGroupId,
    reply_to = null,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    notification_type,
    reply_to,
    group_id: notificationGroupId,
    user_ids: assignees,
    event_type: 'goal_notify_email',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const goalsHistoryUpdateIfReply = valLocals('goalsUpdateIfReply', {
  goal_id: string.require(),
  goal: object.require(),
  reply_to: number,
}, (req, res, next, setLocals) => {
  const {
    goal_id,
    goal,
    reply_to = null,
  } = res.locals;

  if (reply_to === null) {
    return next();
  }

  const replyIndex = goal.history.length - 1;

  return dbGoalsRepliesHistoryUpdate({
    reply_index: replyIndex,
    target: {
      id: goal_id,
      history_index: reply_to,
    },
  })
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
const goalsLoadWay = valLocals('goalsLoadWay', {
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
  const properties = {
    steps,
    step_order,
    attachments,
    attachment_order,
  };

  dbGoalsUpdateSingle({ goal_id, properties })
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
const goalsLoadWayQueueMessage = valLocals('goalsLoadWayQueueMessage', {
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
  goalsCompleteStepQueueMessage,
  goalsIncompleteStepQueueMessage,
  goalsCompleteStep,
  goalsIncompleteStep,
  goalsNotify,
  goalsNotifyQueueMessage,
  goalsNotifyEmailQueueMessage,
  goalsHistoryUpdateIfReply,
  goalsRename,
  goalsRenameQueueMessage,
  goalsLoadWay,
  goalsLoadWayQueueMessage,
  goalsFindCompleteStatus,
  goalsCompleteGoal,
  goalsCompleteQueueMessage,
};
