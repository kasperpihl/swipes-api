import {
  Map,
} from 'immutable';
import {
  dbStepsUpdateSingle,
} from './db_utils/steps';

const stepsGet = (req, res, next) => {
  const {
    goal,
    stepId,
  } = res.locals;

  const steps = goal.steps;
  const n = steps.length;

  for (let i = 0; i < n; i += 1) {
    const step = steps[i];

    if (step.id === stepId) {
      res.locals.step = step;

      break;
    }
  }

  return next();
};

const stepsUpdateData = (req, res, next) => {
  const {
    goal_id,
    step,
    payload,
  } = res.locals;

  const stepMap = Map(step);
  const payloadMap = Map(payload);

  const stepUpdated = stepMap.merge(payloadMap);

  dbStepsUpdateSingle({ goal_id, stepUpdated })
    .then(() => {
      res.locals.eventType = 'step_changed';
      res.locals.eventData = stepUpdated;

      return next();
    })
    .catch((err) => {
      return next(err);
    });
};

export {
  stepsGet,
  stepsUpdateData,
};
