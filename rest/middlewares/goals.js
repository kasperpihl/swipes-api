import config from 'config';
import validator from 'validator';
import r from 'rethinkdb';
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

  goal.steps.map((step) => {
    const stepId = generateSlackLikeId('');

    step.id = goalId + '-' + stepId;

    if (step.type === 'deliver') {
      step.data = {
        deliveries: [{collection: []}]
      }
    }

    return step;
  })

  res.locals.goalId = goalId;
  res.locals.goal = goal;

  return next();
}

const goalsCreate = (req, res, next) => {
  const userId = req.userId;
  const organizationId = req.body.organization_id;
  const processId = req.body.process_id;

  if (validator.isNull(organizationId)) {
    return next(new SwipesError('organization_id is required'));
  }

  if (validator.isNull(processId)) {
    return next(new SwipesError('process_id is required'));
  }

  const {
    goalId,
    goal
  } = res.locals;
  const insertObj = {
    id: goalId,
    process_id: processId, // T_TODO check if this one exists!
    organization_id: organizationId,
    timestamp: r.now(),
    created_by: userId
  }

  const insertQ = r.table('goals').insert(Object.assign({}, goal, insertObj))

  return db.rethinkQuery(insertQ)
    .then(() => {
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

export {
  goalsValidate,
  goalsCreate,
  goalsGet
}
