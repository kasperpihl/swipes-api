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

const goalsValidate = (req, res, next) => {
  const goal = req.body.goal;
  const goalId = generateSlackLikeId('G');

  if (validator.isNull(goal)) {
    return next(new SwipesError('goal is required'));
  }

  goal.steps = goal.steps.map((step) => {
    const stepId = generateSlackLikeId('');
    step = step.set('id', goalId + '-' + stepId);
    return step.toJS();
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
      res.locals.eventType = 'goal_created';
      res.locals.eventMessage = 'Goal "' + goalWithMeta.title + '" has been created';
      res.locals.eventData = goalWithMeta;

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
      res.locals.eventType = 'goal_deleted';
      res.locals.eventMessage = 'Goal has been deleted';
      res.locals.eventData = {id: goalId};

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
