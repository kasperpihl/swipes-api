"use strict";

import validator from 'validator';
import r from 'rethinkdb';
import db from '../db.js';
import SwipesError from '../swipes-error.js';
import { fromJS, Map } from 'immutable'

import requireDir from 'require-dir'
var reducers = requireDir('../reducers', {recurse: true});

console.log('dirs', reducers);

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

  let {
    data,
    action,
    payload,
    step,
  } = res.locals;
  action = 'attach';
  payload = { url: 'a4231' };
  step = {type: 'deliver', subtype: 'collection'};

  const directory = reducers[step.type];
  if(!directory){
    return next('invalid type');
  }

  const file = directory[step.subtype];
  if(!file){
    return next('invalid subtype')
  }

  const reducer = file[action];
  if(typeof reducer !== 'function'){
    return next('invalid action');
  }

  const oldData = fromJS(data);
  let newData = reducer(oldData, payload);
  if(typeof newData === 'string'){
    return next(newData);
  }
  if(!Map.isMap(newData)){
    return next('invalid reducer implementation, should return immutable object');
  }
  res.status(200).send(newData.toJS());
    
  if(newData !== oldData){
    // Run rethinkdb to save new data
  }
}


export {
  stepsAssignValidate,
  stepsAssign,
  stepsDo
}
