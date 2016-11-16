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

  goal.currentStepIndex = -1;
  goal.steps = goal.steps.map((step) => {
    const stepId = generateSlackLikeId('');
    step.id = goalId + '-' + stepId;
    step.iterations = [];

    return step;
  })

  goal.id = goalId;
  goal.workflow_id = workflowId;
  goal.organization_id = organizationId;
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
  let nextStepIndex = ++goal.currentStepIndex;

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
        goal.currentStepIndex = i;
        stepBackFound = true;
      }

      if (stepBackFound && i <= currentStepIndex) {
        step.completed = false;
      }
    })
  }

  const nextStep = goal.steps[nextStepIndex];

  nextStep.iterations.push({
    errorLog: [],
    automationLog: [],
    responses: {}
  })

  return next();
}

const goalsInsert = (req, res, next) => {
  const {
    goal
  } = res.locals;

  const insertQ = r.table('goals').insert(goal);

  return db.rethinkQuery(insertQ)
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

const goalsUpdate = (req, res, next) => {
  const {
    goal
  } = res.locals;

  const updateQ =
    r.table('goals')
      .get(goal.id)
      .update(goal);

  return db.rethinkQuery(updateQ)
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
  goalsDelete,
  goalsInsert,
  goalsNext,
  goalsUpdate
}
