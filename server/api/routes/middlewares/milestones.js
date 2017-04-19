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
    due_date: due_date || null,
    created_by: user_id,
    created_at: r.now(),
    updated_at: r.now(),
    closed: false,
    history: [{
      type: 'milestone_created',
      done_by: user_id,
      done_at: r.now(),
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
  id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    id,
  } = res.locals;
  const historyItem = {
    type: 'milestone_closed',
    done_by: user_id,
    done_at: r.now(),
  };
  const properties = {
    closed: true,
    history: r.row('history').append(historyItem),
    updated_at: r.now(),
  };

  dbMilestonesUpdateSingle({ id, properties })
    .then(() => {
      setLocals({
        eventType: 'milestone_closed',
        id,
      });

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
const milestonesCloseQueueMessage = valLocals('milestonesCloseQueueMessage', {
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
    milestone_id: id,
    event_type: eventType,
  };

  setLocals({
    queueMessage,
    messageGroupId: id,
  });

  return next();
});
const milestonesAddGoal = valLocals('milestonesAddGoal', {
  user_id: string.require(),
  goal_id: string.require(),
  milestone_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    milestone_id,
  } = res.locals;

  dbMilestonesAddGoal({ user_id, goal_id, milestone_id })
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
  notificationGroupId: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    milestone_id,
    goal_order,
    notificationGroupId,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    goal_order,
    milestone_id,
    group_id: notificationGroupId,
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
}, (req, res, next, setLocals) => {
  const {
  user_id,
  goal_id,
  milestone_id,
} = res.locals;

  if (!milestone_id) {
    return next();
  }

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
  notificationGroupId: string.require(),
  eventType: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    milestone_id,
    goal_order,
    notificationGroupId,
    eventType,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    goal_order,
    milestone_id,
    group_id: notificationGroupId,
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
  milestonesCreateQueueMessage,
  milestonesCloseQueueMessage,
  milestonesAddGoal,
  milestonesAddGoalQueueMessage,
  milestonesRemoveGoal,
  milestonesRemoveGoalQueueMessage,
};
