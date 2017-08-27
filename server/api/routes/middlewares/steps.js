import {
  string,
  array,
  object,
  any,
} from 'valjs';
import {
  dbStepsAdd,
  dbStepsRename,
  dbStepsDelete,
  dbStepsReorder,
  dbStepsAssign,
} from './db_utils/steps';
import {
  stepsCreateStep,
} from './utils';
import {
  valLocals,
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

  const mutatedStep = stepsCreateStep({ user_id, ...step });

  dbStepsAdd({ goal_id, step: mutatedStep })
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        step: changes.new_val.steps[mutatedStep.id],
        step_order: changes.new_val.step_order,
        completed_at: changes.new_val.completed_at,
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
  completed_at: any,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step,
    step_order,
    completed_at,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    step,
    step_order,
    completed_at,
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
    .then((results) => {
      const changes = results.changes[0];

      setLocals({
        completed_at: changes.new_val.completed_at,
      });

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
  completed_at: any,
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
    completed_at,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    step_id,
    completed_at,
    event_type: 'step_deleted',
  };

  setLocals({
    queueMessage,
    messageGroupId: goal_id,
  });

  return next();
});
const stepsReorder = valLocals('stepsReorder', {
  goal_id: string.require(),
  step_order: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    goal_id,
    step_order,
  } = res.locals;

  dbStepsReorder({ goal_id, step_order })
    .then(() => {
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
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_order,
  } = res.locals;
  const queueMessage = {
    user_id,
    goal_id,
    step_order,
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
    .then((result) => {
      const newVal = result.changes[0].new_val;
      const oldVal = result.changes[0].old_val;
      const newStepAssignees = newVal.steps[step_id].assignees;
      const oldStepAssignees = oldVal.steps[step_id].assignees;
      const diffAssignees = newStepAssignees.filter(a => !oldStepAssignees.find(b => b === a));

      setLocals({
        goal_assignees: newVal.assignees,
        assignees_diff: diffAssignees,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsAssignQueueMessage = valLocals('stepsAssignQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  step_id: string.require(),
  assignees: array.of(string).require(),
  assignees_diff: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
    assignees,
    assignees_diff,
  } = res.locals;
  const event_type = 'step_assigned';
  const queueMessage = {
    user_id,
    goal_id,
    step_id,
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
