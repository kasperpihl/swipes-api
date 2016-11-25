"use strict";

import {
  Map
} from 'immutable';
import {
  dbStepsUpdateSingle
} from './db_utils/steps';
import {
  generateSlackLikeId
} from '../../utils.js';

const stepsGetCurrent = (req, res, next) => {
  const {
    goal
  } = res.locals;

  res.locals.step = goal.steps[goal.currentStepIndex];

  return next();
}

const stepsSubmit = (req, res, next) => {
  const {
    user_id,
    step,
    data,
    message
  } = res.locals;
  const lastIterationIndex = step.iterations.length - 1;

  step.iterations[lastIterationIndex].responses[user_id] = { data, message }

  if (step.response_type === 'single') {
    res.locals.doNext = true;
  }

  return next();
}

const stepsGet = (req, res, next) => {
  const {
    goal,
    stepId
  } = res.locals;

  const steps = goal.steps;
  const n = steps.length;

  for (let i = 0; i < n; i++) {
    const step = steps[i];

    if (step.id === stepId) {
      res.locals.step = step;

      break;
    }
  }

  return next();
}

const stepsUpdateData = (req, res, next) => {
  const {
    goal_id,
    step,
    payload
  } = res.locals;

  const stepMap = Map(step);
  const payloadMap = Map(payload);

  const stepUpdated = stepMap.merge(payloadMap);

  dbStepsUpdateSingle({ goal_id, step: stepUpdated })
    .then(() => {
      res.locals.eventType = 'step_changed';
      res.locals.eventMessage = stepUpdated.title + ' has been updated';
      res.locals.eventData = stepUpdated;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

export {
  stepsGetCurrent,
  stepsGet,
  stepsUpdateData,
  stepsSubmit
}
