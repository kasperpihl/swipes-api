"use strict";

import validator from 'validator';
import r from 'rethinkdb';
import requireDir from 'require-dir';
import {
  fromJS,
  Map
} from 'immutable';
import {
  reducersGet
} from '../reducers/helpers';
import db from '../db.js';
import SwipesError from '../swipes-error.js';

const reducers = requireDir('../reducers', {recurse: true});

const stepsAssignValidate = (req, res, next) => {
  const goalId = req.body.goal_id;
  const stepId = req.body.step_id;
  const assigneeId = req.body.assignee_id;

  if (validator.isNull(goalId) || validator.isNull(stepId) || validator.isNull(assigneeId)) {
    return next(new SwipesError('goal_id, step_id and assignee_id are required'));
  }

  res.locals.goalId = goalId;
  res.locals.stepId = stepId;
  res.locals.assigneeId = assigneeId;

  return next();
}

const stepsAssign = (req, res, next) => {
  const {
    goalId,
    stepId,
    assigneeId
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
                assignees: step('assignees').append(assigneeId)
              }),
              step
            )
          })
        })
      })

  db.rethinkQuery(updateQ)
    .then(() => {
      res.locals.eventType = 'step_assignee_added';
      res.locals.eventMessage = '';
      res.locals.eventData = {
        goal_id: goalId,
        step_id: stepId,
        assignee_id: assigneeId
      };

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
    step,
    user
  } = res.locals;

  const reducer = reducersGet(step, action);

  if (!reducer) {
    return next('invalid reducer');
  }

  const stepUpdated = reducer(fromJS(step), payload, user.id);

  if (typeof stepUpdated === 'string') {
    return next(stepUpdated);
  }

  if (!Map.isMap(stepUpdated)) {
    return next('invalid reducer implementation, should return immutable object');
  }

  res.locals.stepUpdated = stepUpdated.toJS();

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

const stepsIterate = (req, res, next) => {
  const {
    goal,
    step
  } = res.locals;



  return next();
}

export {
  stepsAssignValidate,
  stepsAssign,
  stepsGetCurrent,
  stepsValidateDoAction,
  stepsDo,
  stepsGet,
  stepsValidateUpdateData,
  stepsUpdateData,
  stepsUpdateRethinkdb,
  stepsIterate
}
