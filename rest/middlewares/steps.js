"use strict";

import validator from 'validator';
import r from 'rethinkdb';
import {
  fromJS,
  Map
} from 'immutable';

import db from '../db.js';
import SwipesError from '../swipes-error.js';

const stepsGetCurrent = (req, res, next) => {
  const {
    goal
  } = res.locals;

  res.locals.step = goal.steps[goal.currentStepIndex];

  return next();
}

const stepsValidateSubmit = (req, res, next) => {
  const goalId = req.body.goal_id;
  if (validator.isNull(goalId)) {
    return next(new SwipesError('goal_id is required'));
  }

  const data = req.body.data;
  if(typeof data !== 'object'){
    return next(new SwipesError('data must be object'));
  }

  const message = req.body.message;
  if (message && typeof message !== 'string') {
    return next(new SwipesError('message must be string'));
  }

  res.locals.goalId = goalId;
  res.locals.data = data;
  res.locals.message = message;

  if (req.body.step_back_id) {
    res.locals.stepBackId = req.body.step_back_id;
  }

  return next();
}

const stepsSubmit = (req, res, next) => {
  const userId = req.userId;
  const {
    step,
    data,
    message,
    step_back_id
  } = res.locals;
  const lastIterationIndex = step.iterations.length - 1;

  step.iterations[lastIterationIndex].responses[userId] = { data, message }

  if (step.response_type === 'single') {
    res.locals.doNext = true;
  }

  return next();
}


const stepsValidateUpdateData = (req, res, next) => {
  const goalId = req.body.goal_id;
  const stepId = req.body.step_id;
  const payload = req.body.payload;

  res.locals.goalId = goalId;
  res.locals.stepId = stepId;
  res.locals.payload = payload;

  if (validator.isNull(goalId) || validator.isNull(stepId) || validator.isNull(payload)) {
    return next(new SwipesError('goal_id, step_id and payload are required'));
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
    step,
    payload
  } = res.locals;

  const stepMap = Map(step);
  const payloadMap = Map(payload);

  const stepUpdated = stepMap.merge(payloadMap);

  res.locals.stepUpdated = stepUpdated.toJS();

  return next();
}

const stepsUpdateRethinkdb = (req, res, next) => {
  const {
    goalId,
    stepUpdated
  } = res.locals;

  const updateQ =
    r.db('swipes')
      .table('goals')
      .get(goalId)
      .update((goal) => {
        return goal.merge({
          steps: goal('steps').map((step) => {
            return r.branch(
              step('id').eq(stepUpdated.id),
              step.merge(stepUpdated),
              step
            )
          })
        })
      })

  db.rethinkQuery(updateQ)
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
  stepsValidateSubmit,
  stepsSubmit,
  stepsGet,
  stepsValidateUpdateData,
  stepsUpdateData,
  stepsUpdateRethinkdb
}
