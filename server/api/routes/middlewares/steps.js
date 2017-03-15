import r from 'rethinkdb';
import {
  string,
  array,
  object,
} from 'valjs';
import {
  dbStepsAdd,
  dbStepsRename,
  dbStepsDelete,
  dbStepsReorder,
  dbStepsAssign,
} from './db_utils/steps';
import {
  valLocals,
  generateSlackLikeId,
} from '../../utils';

const stepsAdd = valLocals('stepsAdd', {
  user_id: string.require(),
  goal_id: string.require(),
  step: object.as({
    title: string.min(1).require(),
    assignees: array.require(),
  }).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step,
  } = res.locals;

  const step_id = generateSlackLikeId('', 6);
  const mutatedStep = Object.assign({}, step, {
    id: step_id,
    created_by: user_id,
    created_at: r.now(),
    updated_at: r.now(),
    updated_by: user_id,
  });

  dbStepsAdd({ user_id, goal_id, step: mutatedStep })
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        step: changes.new_val.steps[step_id],
        step_order: changes.new_val.step_order,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsAddQueueMessage = valLocals('stepsAddQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  step: object.require(),
  step_order: array.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step,
    step_order,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    step,
    step_order,
    event_type: 'step_added',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const stepsRename = valLocals('stepsRename', {
  user_id: string.require(),
  goal_id: string.require(),
  step_id: string.require(),
  title: string.require().min(1),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
    title,
  } = res.locals;

  dbStepsRename({ user_id, goal_id, step_id, title })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsRenameQueueMessage = valLocals('stepsRenameQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  step_id: string.require(),
  title: string.min(1).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
    title,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    step_id,
    title,
    event_type: 'step_renamed',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const stepsDelete = valLocals('stepsDelete', {
  user_id: string.require(),
  goal_id: string.require(),
  step_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
  } = res.locals;

  dbStepsDelete({ user_id, goal_id, step_id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsDeleteQueueMessage = valLocals('stepsDeleteQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  step_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    step_id,
    event_type: 'step_deleted',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const stepsReorder = valLocals('stepsReorder', {
  user_id: string.require(),
  goal_id: string.require(),
  step_order: array.of(string).require(),
  current_step_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_order,
    current_step_id,
  } = res.locals;

  dbStepsReorder({ user_id, goal_id, step_order, current_step_id })
    .then((results) => {
      const changes = results.changes[0];
      let status = {};

      if (changes) {
        status = changes.new_val.status;
      }

      setLocals({
        status,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsReorderQueueMessage = valLocals('stepsReorderQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  step_order: array.of(string).require(),
  status: object.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_order,
    status,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    step_order,
    status,
    event_type: 'step_reordered',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const stepsAssign = valLocals('stepsAssign', {
  user_id: string.require(),
  goal_id: string.require(),
  step_id: string.require(),
  assignees: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
    assignees,
  } = res.locals;

  dbStepsAssign({ user_id, goal_id, step_id, assignees })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsAssignQueueMessage = valLocals('stepsAssignQueueMessage', {
  user_id: string.require(),
  step_id: string.require(),
  assignees: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
    assignees,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    step_id,
    assignees,
    event_type: 'step_assigned',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});

export {
  stepsAdd,
  stepsRename,
  stepsDelete,
  stepsReorder,
  stepsAssign,
  stepsAddQueueMessage,
  stepsRenameQueueMessage,
  stepsDeleteQueueMessage,
  stepsReorderQueueMessage,
  stepsAssignQueueMessage,
};
