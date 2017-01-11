import r from 'rethinkdb';
import {
  string,
  object,
  bool,
} from 'valjs';
import {
  dbGoalsInsertSingle,
  dbGoalsUpdateSingle,
  dbGoalsGetSingle,
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
  goal: object.require(),
  organization_id: string.require(),
  workflow_id: string,
}, (req, res, next) => {
  const {
    user_id,
    goal,
    organization_id,
    workflow_id,
  } = res.locals;
  const goalId = generateSlackLikeId('G');

  goal.currentStepIndex = -1;
  goal.steps = goal.steps.map((step) => {
    const stepId = generateSlackLikeId('');

    step.id = `${goalId}-${stepId}`;
    step.iterations = [];

    return step;
  });

  goal.id = goalId;
  if (workflow_id) {
    goal.workflow_id = workflow_id;
  }

  goal.organization_id = organization_id;
  goal.timestamp = r.now();
  goal.created_at = r.now();
  goal.updated_at = r.now();
  goal.created_by = user_id;
  goal.deleted = false;

  res.locals.doNext = true;

  return next();
});

const goalsNext = valLocals('goalsNext', {
  goal: object.require(),
  doNext: bool.require(),
  step_back_id: string.require(),
}, (req, res, next) => {
  const {
    goal,
    doNext,
    step_back_id,
  } = res.locals;
  const currentStepIndex = goal.currentStepIndex;
  const currentStep = goal.steps[currentStepIndex];
  let nextStepIndex = goal.currentStepIndex + 1;

  if (!doNext) {
    return next();
  }

  if (currentStep) {
    currentStep.completed = true;
  }

  if (step_back_id) {
    let stepBackFound = false;

    goal.steps.map((step, i) => {
      /* Find steps before the step we are going back to
         and find steps after the current step and add null iteration
      */
      if ((!stepBackFound && step.id !== step_back_id) || i > currentStepIndex) {
        step.iterations.push(null);
      } else if (step.id === step_back_id) {
        nextStepIndex = i;
        stepBackFound = true;
      }

      if (stepBackFound && i <= currentStepIndex) {
        step.completed = false;
      }

      return step;
    });
  }

  const nextStep = goal.steps[nextStepIndex];
  // Check that next step is not the last step
  if (nextStep) {
    goal.currentStepIndex = nextStepIndex;
    nextStep.iterations.push({
      errorLog: [],
      automationLog: [],
      previousStepIndex: currentStepIndex,
      responses: {},
    });
  }

  return next();
});

const goalsInsert = valLocals('goalsInsert', {
  goal: object.require(),
}, (req, res, next) => {
  const {
    goal,
  } = res.locals;

  dbGoalsInsertSingle({ goal })
    .then((obj) => {
      res.locals.eventType = 'goal_created';
      res.locals.returnObj = { data: obj.changes[0].new_val };
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

const goalsDelete = valLocals('goalsDelete', {
  goal_id: string.require(),
}, (req, res, next) => {
  const {
    goal_id,
  } = res.locals;
  const properties = { deleted: true };

  dbGoalsUpdateSingle({ goal_id, properties })
    .then(() => {
      res.locals.eventType = 'goal_deleted';

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

const goalsGet = (req, res, next) => {
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
};

const goalsUpdate = (req, res, next) => {
  const {
    goal_id,
    goal,
  } = res.locals;

  dbGoalsUpdateSingle({ goal_id, properties: goal })
    .then(() => {
      res.locals.eventType = 'goal_updated';
      res.locals.eventData = goal;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

const goalsUpdateData = (req, res, next) => {
  const {
    goal_id,
    goal,
  } = res.locals;

  dbGoalsUpdateSingle({ goal_id, properties: goal })
    .then(() => {
      res.locals.eventType = 'goal_updated';
      res.locals.eventData = goal;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

const goalsCreateQueueMessage = valLocals('goalsCreateQueueMessage', {
  user_id: string.require(),
  goal: object.require(),
  eventType: string.require(),
}, (req, res, next) => {
  const {
    user_id,
    goal,
    eventType,
  } = res.locals;

  const goal_id = goal.id;

  res.locals.queueMessage = {
    user_id,
    goal_id,
    event_type: eventType,
  };
  res.locals.messageGroupId = goal_id;

  return next();
});

const goalsDeleteQueueMessage = valLocals('goalsDeleteQueueMessage', {
  user_id: string.require(),
  goal_id: string.require(),
  eventType: string.require(),
}, (req, res, next) => {
  const {
    user_id,
    goal_id,
    eventType,
  } = res.locals;

  res.locals.queueMessage = {
    user_id,
    goal_id,
    event_type: eventType,
  };
  res.locals.messageGroupId = goal_id;

  return next();
});

const goalsNextStepQueueMessage = (req, res, next) => {
  const {
    user_id,
    goal,
  } = res.locals;

  const goal_id = goal.id;

  res.locals.queueMessage = {
    user_id,
    goal_id,
    event_type: 'step_completed',
  };
  res.locals.messageGroupId = goal_id;

  return next();
};

const goalsStepGotActiveQueueMessage = (req, res, next) => {
  const {
    user_id,
    goal,
  } = res.locals;

  const goal_id = goal.id;
  const current_step_id = goal.currentStepIndex;

  res.locals.queueMessage = {
    user_id,
    goal_id,
    current_step_id,
    event_type: 'step_got_active',
  };
  res.locals.messageGroupId = goal_id;

  return next();
};

export {
  goalsCreate,
  goalsNext,
  goalsInsert,
  goalsDelete,
  goalsGet,
  goalsUpdate,
  goalsUpdateData,
  goalsCreateQueueMessage,
  goalsDeleteQueueMessage,
  goalsNextStepQueueMessage,
  goalsStepGotActiveQueueMessage,
};
