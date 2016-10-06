"use strict";

import config from 'config';
import validator from 'validator';
import r from 'rethinkdb';
import {
  fromJS,
  Map
} from 'immutable';
import db from '../db.js';
import SwipesError from '../swipes-error.js';
import {
  generateSlackLikeId
} from '../util.js';
import {
  reducersGet
} from '../reducers/helpers';

const goalsValidate = (req, res, next) => {
  const goal = req.body.goal;
  const goalId = generateSlackLikeId('G');

  if (validator.isNull(goal)) {
    return next(new SwipesError('goal is required'));
  }

  goal.steps = goal.steps.map((step) => {
    const stepId = generateSlackLikeId('');
    const reducer = reducersGet(step);
    step.id = goalId + '-' + stepId;

    if (!reducer) {
      return next('invalid init reducer');
    }

    const stepInited = reducer(fromJS(step));

    return stepInited.toJS();
  })

  res.locals.goalId = goalId;
  res.locals.goal = goal;

  return next();
}

const goalsCreate = (req, res, next) => {
  const userId = req.userId;
  const organizationId = req.body.organization_id;
  const workflowId = req.body.workflow_id;

  if (validator.isNull(organizationId)) {
    return next(new SwipesError('organization_id is required'));
  }

  if (validator.isNull(workflowId)) {
    return next(new SwipesError('workflow_id is required'));
  }

  const {
    goalId,
    goal
  } = res.locals;
  const metaObj = {
    id: goalId,
    workflow_id: workflowId, // T_TODO check if this one exists!
    organization_id: organizationId,
    timestamp: r.now(),
    created_by: userId,
    deleted: false
  }

  const goalWithMeta = Object.assign({}, goal, metaObj);

  const insertQ = r.table('goals').insert(goalWithMeta);

  return db.rethinkQuery(insertQ)
    .then(() => {
      res.locals.goalWithMeta = goalWithMeta;

      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

const goalsGet = (req, res, next) => {
  const {
    goalId
  } = res.locals;

  const q = r.table('goals').get(goalId);

  db.rethinkQuery(q)
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

const goalsDelete = (req, res, next) => {
  const goalId = req.body.goal_id;

  if (validator.isNull(goalId)) {
    return next(new SwipesError('goal_id is required'));
  }

  const updateQ =
    r.table('goals')
      .get(goalId)
      .update({
        deleted: true
      });

  return db.rethinkQuery(updateQ)
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    })
}

export {
  goalsValidate,
  goalsCreate,
  goalsGet,
  goalsDelete
}
