"use strict";

import validator from 'validator';
import r from 'rethinkdb';
import db from '../db.js';
import SwipesError from '../swipes-error.js';
import { fromJS } from 'immutable'

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

const stepsValidateDoAction = (req, res, next) => {
  const action = req.body.action;
  if (typeof action !== 'string') {
    return next(new SwipesError('action required (string)'));
  }

  const payload = req.body.payload;
  if(payload && typeof payload !== 'object'){
    return next(new SwipesError('payload must be object'));
  }

  res.locals.action = action;
  res.locals.payload = payload;
  next();
}

const stepsDo = (req, res, next) => {
  const {
    action,
    payload
  } = res.locals;

  const existingDataFromRethink = {} // rethink query to fetch data object in step

  var handler = require('../handlers/deliver/collection');
  
  let oldData = fromJS(existingDataFromRethink);
  let newData = handler.do(oldData, action, payload);
  if(oldData !== newData){
    // Run rethinkdb to save new data
  }
}

export {
  stepsAssignValidate,
  stepsAssign,
  stepsDo
}
