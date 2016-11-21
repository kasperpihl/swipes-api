"use strict";

import r from 'rethinkdb';
import {
  dbGoalsInsertSingle,
  dbGoalsUpdateSingle,
  dbGoalsGetSingle
} from './db_utils/goals';
import {
  generateSlackLikeId
} from '../../utils.js';

const goalsCreate = (req, res, next) => {
  const userId = req.userId;
  const {
    goal,
    organization_id,
    workflow_id
  } = res.locals;
  const goalId = generateSlackLikeId('G');

  goal.currentStepIndex = -1;
  goal.steps = goal.steps.map((step) => {
    const stepId = generateSlackLikeId('');

    step.id = goalId + '-' + stepId;
    step.iterations = [];

    return step;
  })

  goal.id = goalId;
  goal.workflow_id = workflow_id;
  goal.organization_id = organization_id;
  goal.timestamp = r.now();
  goal.created_by = userId;
  goal.deleted = false;

  res.locals.doNext = true;

  return next();
}

const goalsNext = (req, res, next) => {
  const {
    goal,
    doNext,
    stepBackId
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

  if (stepBackId) {
    let stepBackFound = false;

    goal.steps.map((step, i) => {
      /* Find steps before the step we are going back to
         and find steps after the current step and add null iteration
      */
      if (!stepBackFound && step.id !== stepBackId || i > currentStepIndex) {
        step.iterations.push(null);
      } else if (step.id === stepBackId) {
        nextStepIndex = i;
        stepBackFound = true;
      }

      if (stepBackFound && i <= currentStepIndex) {
        step.completed = false;
      }
    })
  }


  const nextStep = goal.steps[nextStepIndex];
  // Check that next step is not the last step
  if (nextStep) {
    goal.currentStepIndex = nextStepIndex;
    nextStep.iterations.push({
      errorLog: [],
      automationLog: [],
      previousStepIndex: currentStepIndex,
      responses: {}
    })
  }

  return next();
}

const goalsInsert = (req, res, next) => {
  const {
    goal
  } = res.locals;

  dbGoalsInsertSingle({ goal })
    .then(() => {
      res.locals.goalWithMeta = goal;
      res.locals.eventType = 'goal_created';
      res.locals.eventMessage = 'Goal "' + goal.title + '" has been created';
      res.locals.eventData = goal;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const goalsDelete = (req, res, next) => {
  const {
    goal_id
  } = res.locals;
  const properties = { deleted: true };

  dbGoalsUpdateSingle({ goal_id, properties })
    .then(() => {
      res.locals.eventType = 'goal_deleted';
      res.locals.eventMessage = 'Goal has been deleted';
      res.locals.eventData = {id: goal_id};

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const goalsGet = (req, res, next) => {
  const {
    goal_id
  } = res.locals;

  dbGoalsGetSingle({ goal_id })
    .then((goal) => {
      if (!goal) {
        return next(new SwipesError('goal not found'));
      }

      res.locals.goal = goal;

      return next()
    })
    .catch((err) => {
      return next(err);
    })
}

const goalsUpdate = (req, res, next) => {
  const {
    goal
  } = res.locals;

  dbGoalsUpdateSingle({ goal_id: goal.id, properties: goal })
    .then(() => {
      res.locals.eventType = 'goal_updated';
      res.locals.eventMessage = 'Goal has been updated';
      res.locals.eventData = goal;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

export {
  goalsCreate,
  goalsNext,
  goalsInsert,
  goalsDelete,
  goalsGet,
  goalsUpdate
}
