import r from 'rethinkdb';
import {
  string,
  object,
  array,
} from 'valjs';
import {
  dbMilestonesInsertSingle,
  dbMilestonesUpdateSingle,
  dbMilestonesAddGoal,
  dbMilestonesRemoveGoal,
  dbMilestonesMigrateIncompleteGoals,
} from './db_utils/milestones';
import {
  generateSlackLikeId,
  valLocals,
} from '../../utils';

const milestonesCreate = valLocals('milestonesCreate', {
  user_id: string.require(),
  title: string.require(),
  organization_id: string.require(),
  notificationGroupId: string.require(),
  due_date: string.format('iso8601'),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    title,
    organization_id,
    notificationGroupId,
    due_date,
  } = res.locals;
  const milestone = {
    id: generateSlackLikeId('M'),
    title,
    organization_id,
    goal_order: [],
    due_date: due_date || null,
    created_by: user_id,
    created_at: r.now(),
    updated_at: r.now(),
    closed: false,
    history: [{
      type: 'milestone_created',
      done_by: user_id,
      done_at: r.now(),
      group_id: notificationGroupId,
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
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    notificationGroupId,
  } = res.locals;
  const historyItem = {
    type: 'milestone_closed',
    done_by: user_id,
    done_at: r.now(),
    group_id: notificationGroupId,
  };
  const properties = {
    closed: true,
    history: r.row('history').append(historyItem),
    updated_at: r.now(),
  };

  setLocals({
    properties,
    eventType: 'milestone_closed',
  });

  return next();
});
const milestonesOpen = valLocals('milestonesOpen', {
  user_id: string.require(),
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    notificationGroupId,
  } = res.locals;
  const historyItem = {
    type: 'milestone_opened',
    done_by: user_id,
    done_at: r.now(),
    group_id: notificationGroupId,
  };
  const properties = {
    closed: false,
    history: r.row('history').append(historyItem),
    updated_at: r.now(),
  };

  setLocals({
    properties,
    eventType: 'milestone_closed',
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
    .then(() => {
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
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    milestone,
    eventType,
    notificationGroupId,
  } = res.locals;
  const milestone_id = milestone.id;
  const queueMessage = {
    user_id,
    milestone_id,
    event_type: eventType,
    group_id: notificationGroupId,
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
  notificationGroupId: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    milestone_id,
    eventType,
    notificationGroupId,
  } = res.locals;
  const queueMessage = {
    user_id,
    milestone_id,
    event_type: eventType,
    group_id: notificationGroupId,
  };

  setLocals({
    queueMessage,
    messageGroupId: milestone_id,
  });

  return next();
});
const milestonesRenameQueueMessage = valLocals('milestonesRenameQueueMessage', {
  milestone_id: string.require(),
  title: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    milestone_id,
    title,
    eventType,
  } = res.locals;
  const queueMessage = {
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
  user_id: string.require(),
  goal_id: string.require(),
  milestone_id: string,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    milestone_id,
  } = res.locals;

  if (!milestone_id) {
    return next();
  }

  return dbMilestonesAddGoal({ user_id, goal_id, milestone_id })
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
  goal_order: array.require(),
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
const milestonesRemoveGoal = valLocals('milestonesRemoveGoal', {
  user_id: string.require(),
  goal_id: string.require(),
  milestone_id: string,
  current_milestone_id: string,
}, (req, res, next, setLocals) => {
  const {
  user_id,
  goal_id,
  current_milestone_id,
} = res.locals;
  let {
  milestone_id,
} = res.locals;

  if (!milestone_id && !current_milestone_id) {
    return next();
  }

  milestone_id = current_milestone_id || milestone_id;

  return dbMilestonesRemoveGoal({ user_id, goal_id, milestone_id })
  .then((result) => {
    const changes = result.changes[0].new_val || result.changes[0].old_val;

    setLocals({
      goal_order: changes.goal_order,
      eventType: 'milestone_goal_removed',
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
  goal_order: array.require(),
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
};
