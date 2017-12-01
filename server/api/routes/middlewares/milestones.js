import r from 'rethinkdb';
import {
  string,
  number,
  object,
  array,
  any,
} from 'valjs';
import {
  goalsCompleteGoal,
  goalsCompleteQueueMessage,
  goalsIncompleteGoal,
  goalsIncompleteQueueMessage,
} from './goals';
import {
  notificationsPushToQueue,
} from './notifications';
import {
  dbMilestonesInsertSingle,
  dbMilestonesUpdateSingle,
  dbMilestonesAddGoal,
  dbMilestonesRemoveGoal,
  dbMilestonesMigrateIncompleteGoals,
  dbMilestonesGoalsReorder,
  dbMilestonesDelete,
} from './db_utils/milestones';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const milestonesCreate = valLocals('milestonesCreate', {
  user_id: string.require(),
  title: string.require(),
  organization_id: string.require(),
  due_date: string.format('iso8601'),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    title,
    organization_id,
    due_date,
  } = res.locals;
  const milestone = {
    id: generateSlackLikeId('M'),
    title,
    organization_id,
    goal_order: {
      now: [],
      later: [],
      done: [],
    },
    due_date: due_date || null,
    created_by: user_id,
    created_at: new Date(),
    updated_at: new Date(),
    closed_at: null,
    history: [{
      type: 'milestone_created',
      done_by: user_id,
      done_at: new Date(),
    }],
  };

  setLocals({
    milestone,
  });

  return next();
});
const milestonesInsert = valLocals('milestonesInsert', {
  milestone: object.as({
    id: string.require(),
    title: string.require(),
  }).require(),
}, (req, res, next, setLocals) => {
  const {
    milestone,
  } = res.locals;

  dbMilestonesInsertSingle({ milestone })
    .then((obj) => {
      setLocals({
        eventType: 'milestone_created',
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestonesClose = valLocals('milestonesClose', {
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;
  const closedAt = new Date();
  const type = 'milestone_closed';
  const historyItem = {
    type,
    done_by: user_id,
    done_at: new Date(),
  };
  const properties = {
    closed_at: closedAt,
    history: r.row('history').append(historyItem),
    updated_at: new Date(),
  };

  setLocals({
    closed_at: closedAt,
    properties,
    eventType: type,
  });

  return next();
});
const milestonesOpen = valLocals('milestonesOpen', {
  user_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
  } = res.locals;
  const type = 'milestone_opened';
  const historyItem = {
    type,
    done_by: user_id,
    done_at: r.now(),
  };
  const properties = {
    closed_at: null,
    history: r.row('history').append(historyItem),
    updated_at: r.now(),
  };

  setLocals({
    properties,
    eventType: type,
  });

  return next();
});
const milestoneMigrateIncompleteGoals = valLocals('milestoneMigrateIncompleteGoals', {
  milestone_id: string.require(),
  migrate_to_milestone_id: string,
}, (req, res, next, setLocals) => {
  const {
    milestone_id,
    migrate_to_milestone_id = null,
  } = res.locals;

  dbMilestonesMigrateIncompleteGoals({ milestone_id, migrate_to_milestone_id })
    .then((goalIdsToRemoveFromMilestone) => {
      setLocals({
        goal_ids: goalIdsToRemoveFromMilestone,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestoneRename = valLocals('milestoneRename', {
  title: string.require(),
}, (req, res, next, setLocals) => {
  const {
    title,
  } = res.locals;

  setLocals({
    properties: {
      title,
    },
    eventType: 'milestone_renamed',
  });

  return next();
});
const milestonesUpdateSingle = valLocals('milestonesUpdateSingle', {
  properties: object.require(),
  milestone_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    properties,
    milestone_id,
  } = res.locals;

  dbMilestonesUpdateSingle({ milestone_id, properties })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestonesCreateQueueMessage = valLocals('milestonesCreateQueueMessage', {
  user_id: string.require(),
  milestone: object.as({
    id: string.require(),
  }).require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    milestone,
    eventType,
  } = res.locals;
  const milestone_id = milestone.id;
  const queueMessage = {
    user_id,
    milestone_id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: milestone_id,
  });

  return next();
});
const milestonesOpenCloseQueueMessage = valLocals('milestonesOpenCloseQueueMessage', {
  user_id: string.require(),
  milestone_id: string.require(),
  eventType: string.require(),
  goal_ids: array,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    milestone_id,
    eventType,
    goal_ids = [],
  } = res.locals;
  const queueMessage = {
    user_id,
    milestone_id,
    goal_ids,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: milestone_id,
  });

  return next();
});
const milestonesRenameQueueMessage = valLocals('milestonesRenameQueueMessage', {
  user_id: string.require(),
  milestone_id: string.require(),
  title: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    milestone_id,
    title,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    milestone_id,
    title,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: milestone_id,
  });

  return next();
});
const milestonesAddGoal = valLocals('milestonesAddGoal', {
  goal_id: string.require(),
  milestone_id: string,
}, (req, res, next, setLocals) => {
  const {
    goal_id,
    milestone_id,
  } = res.locals;

  if (!milestone_id) {
    return next();
  }

  return dbMilestonesAddGoal({ goal_id, milestone_id })
    .then((result) => {
      const changes = result.changes[0].new_val || result.changes[0].old_val;

      setLocals({
        goal_order: changes.goal_order,
        eventType: 'milestone_goal_added',
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestonesAddGoalQueueMessage = valLocals('milestonesAddGoalQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  milestone_id: string.require(),
  old_milestone_id: string,
  goal_order: object.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    milestone_id,
    old_milestone_id,
    goal_order,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    goal_order,
    milestone_id,
    old_milestone_id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const milestonesRemoveGoal = valLocals('milestonesRemoveGoal', {
  goal_ids: array.require(),
  milestone_id: string,
  current_milestone_id: string,
  eventType: string,
}, (req, res, next, setLocals) => {
  const {
    goal_ids,
    current_milestone_id,
  } = res.locals;
  let {
    milestone_id,
    eventType,
  } = res.locals;

  if (!milestone_id && !current_milestone_id) {
    return next();
  }

  milestone_id = current_milestone_id || milestone_id;

  return dbMilestonesRemoveGoal({ goal_ids, milestone_id })
    .then((result) => {
      const changes = result.changes[0].new_val || result.changes[0].old_val;
      eventType = goal_ids.length > 0 ? eventType : 'milestone_goal_removed';

      setLocals({
        eventType,
        goal_order: changes.goal_order,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestonesRemoveGoalQueueMessage = valLocals('milestonesRemoveGoalQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  milestone_id: string.require(),
  goal_order: object.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    milestone_id,
    goal_order,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    goal_order,
    milestone_id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const milestonesGoalsReorder = valLocals('milestonesGoalsReorder', {
  milestone_id: string.require(),
  goal_id: string.require(),
  destination: any.of('now', 'later', 'done').require(),
  position: number.require(),
}, (req, res, next, setLocals) => {
  const {
    milestone_id,
    goal_id,
    destination,
    position,
  } = res.locals;

  dbMilestonesGoalsReorder({
    milestone_id,
    goal_id,
    destination,
    position,
  })
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        goal_order: changes.new_val.goal_order,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestonesGoalsReorderQueueMessage = valLocals('milestonesGoalsReorderQueueMessage', {
  user_id: string.require(),
  milestone_id: string.require(),
  goal_order: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    milestone_id,
    goal_order,
  } = res.locals;
  const queueMessage = {
    user_id,
    milestone_id,
    goal_order,
    event_type: 'milestone_goals_reordered',
  };

  setLocals({
    queueMessage,
    messageGroupId: milestone_id,
  });

  return next();
});
const milestonesDelete = valLocals('milestonesDelete', {
  milestone_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    milestone_id,
  } = res.locals;

  dbMilestonesDelete({ milestone_id })
    .then((goal_order) => {
      setLocals({
        goal_ids: [
          ...goal_order.now,
          ...goal_order.later,
          ...goal_order.done,
        ],
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const milestonesDeleteQueueMessage = valLocals('milestonesDeleteQueueMessage', {
  user_id: string.require(),
  milestone_id: string.require(),
  goal_ids: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    milestone_id,
    goal_ids,
  } = res.locals;
  const queueMessage = {
    user_id,
    milestone_id,
    goal_ids,
    event_type: 'milestone_deleted',
  };

  setLocals({
    queueMessage,
    messageGroupId: milestone_id,
  });

  return next();
});
const milestonesGoalsMiddlewares = valLocals('milestonesGoalsMiddlewares', {
  goal: object.require(),
  destination: any.of('now', 'later', 'done').require(),
}, (req, res, next, setLocals) => {
  const {
    goal,
    destination,
  } = res.locals;

  if (
    (!goal.completed_at && destination !== 'done') ||
    (goal.completed_at !== null && destination === 'done')
  ) {
    return next();
  }

  let goalsMiddlewares = [];

  if (destination === 'done') {
    goalsMiddlewares = [
      goalsCompleteGoal,
      goalsCompleteQueueMessage,
    ];
  } else {
    goalsMiddlewares = [
      goalsIncompleteGoal,
      goalsIncompleteQueueMessage,
    ];
  }

  goalsMiddlewares.push(notificationsPushToQueue);

  setLocals({
    goalsMiddlewares,
  });

  return next();
});

export {
  milestonesCreate,
  milestonesInsert,
  milestonesClose,
  milestonesOpen,
  milestonesUpdateSingle,
  milestonesCreateQueueMessage,
  milestonesOpenCloseQueueMessage,
  milestonesAddGoal,
  milestonesAddGoalQueueMessage,
  milestonesRemoveGoal,
  milestonesRemoveGoalQueueMessage,
  milestoneMigrateIncompleteGoals,
  milestoneRename,
  milestonesRenameQueueMessage,
  milestonesGoalsReorder,
  milestonesGoalsReorderQueueMessage,
  milestonesDelete,
  milestonesDeleteQueueMessage,
  milestonesGoalsMiddlewares,
};
