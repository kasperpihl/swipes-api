"use strict";

import validator from 'validator';
import r from 'rethinkdb';
import requireDir from 'require-dir';
import {
  fromJS,
  Map
} from 'immutable';

import db from '../db.js';
import SwipesError from '../swipes-error.js';

const reducers = requireDir('../reducers', {recurse: true});

const stepsAssignValidate = (req, res, next) => {
  const goalId = req.body.goal_id;
  const stepId = req.body.step_id;
  const assignee = req.body.assignee;

  if (validator.isNull(goalId) || validator.isNull(stepId) || validator.isNull(assignee)) {
    return next(new SwipesError('goal_id, step_id and assignee are required'));
  }

  res.locals.goalId = goalId;
  res.locals.stepId = stepId;
  res.locals.assignee = assignee;

  return next();
}

const stepsAssign = (req, res, next) => {
  const {
    goalId,
    stepId,
    assignee
  } = res.locals;

  const updateQ =
    r.db('swipes')
      .table('goals')
      .get(goalId)
      .update((goal) => {
        return goal.merge({
          steps: goal('steps').map((step) => {
            return r.branch(
              step('id').eq(stepId),
              step.merge({
                assignees: step('assignees').append(assignee)
              }),
              step
            )
          })
        })
      })

  db.rethinkQuery(updateQ)
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const stepsGetCurrent = (req, res, next) => {
  const {
    goal
  } = res.locals;

  const steps = goal.steps;
  const n = steps.length;

  for (let i = 0; i < n; i++) {
    const step = steps[i];

    if (!step.completed) {
      res.locals.step = step;

      break;
    }
  }

  return next();
}

const stepsValidateDoAction = (req, res, next) => {
  const goalId = req.body.goal_id;
  if (validator.isNull(goalId)) {
    return next(new SwipesError('goal_id is required'));
  }

  const payload = req.body.payload;
  if(payload && typeof payload !== 'object'){
    return next(new SwipesError('payload must be object'));
  }

  const action = req.body.action;
  if (typeof action !== 'string') {
    return next(new SwipesError('action required (string)'));
  }

  res.locals.goalId = goalId;
  res.locals.payload = payload;
  res.locals.action = action;

  return next();
}

const stepsDo = (req, res, next) => {
  let {
    action,
    payload,
    step
  } = res.locals;

  const directory = reducers[step.type];
  if (!directory) {
    return next('invalid type');
  }

  const file = directory[step.subtype];
  if (!file) {
    return next('invalid subtype')
  }

  const reducer = file[action];
  if (typeof reducer !== 'function') {
    return next('invalid action');
  }

  const stepUpdated = reducer(step, payload);

  if (typeof stepUpdated === 'string') {
    return next(stepUpdated);
  }

  if (!Map.isMap(stepUpdated)) {
    return next('invalid reducer implementation, should return immutable object');
  }

  res.locals.stepUpdated = stepUpdated.toJS();

  return next();
}

const stepsUpdate = (req, res, next) => {
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
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}


export {
  stepsAssignValidate,
  stepsAssign,
  stepsGetCurrent,
  stepsValidateDoAction,
  stepsDo,
  stepsUpdate
}
