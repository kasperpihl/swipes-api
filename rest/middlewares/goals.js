import config from 'config';
import validator from 'validator';
import r from 'rethinkdb';
import db from '../db.js';
import SwipesError from '../swipes-error.js';

const goalsValidate = (req, res, next) => {
  const goal = req.body.goal;

  goal.steps.map((step) => {
    if (step.type === 'deliver') {
      step.data = {
        deliveries: [{collection: []}]
      }
    }

    return step;
  })

  res.locals.goal = goal;

  return next();
}

const goalsCreate = (req, res, next) => {
  const userId = req.userId;
  const timestamp = new Date().UTC();
  const processId = req.body.process_id;
  const {
    goal
  } = res.locals;
  const insertQ = r.table('goals').insert({
    timestamp,
    goal,
    process_id: processId, // T_TODO check if this one exists!
    created_by: userId
  })

  return next();
}

export {
  goalsValidate,
  goalsCreate
}
