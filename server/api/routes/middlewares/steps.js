import r from 'rethinkdb';
import {
  string,
  array,
  object,
} from 'valjs';
import {
  dbStepsAdd,
  dbStepsRename,
  dbStepsDelete,
  dbStepsReorder,
  dbStepsAssign,
} from './db_utils/steps';
import {
  valLocals,
  generateSlackLikeId,
} from '../../utils';
import {
  SwipesError,
} from '../../../middlewares/swipes-error';

const stepsAdd = valLocals('stepsAdd', {
  user_id: string.require(),
  goal_id: string.require(),
  step: object.as({
    title: string.min(1).require(),
    assignees: array.require(),
  }).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step,
  } = res.locals;

  const mutatedStep = Object.assign({}, step, {
    id: generateSlackLikeId('', 6),
    created_by: user_id,
    created_at: r.now(),
    updated_at: r.now(),
    updated_by: user_id,
  });

  dbStepsAdd({ user_id, goal_id, step: mutatedStep })
    .then((results) => {
      const changes = results.changes[0];

      if (!changes) {
        return next(new SwipesError('No changes', {
          middleware: 'stepsAddStep',
          value: {
            goal_id,
            step,
          },
        }));
      }

      setLocals({
        step,
        step_order: changes.new_val.step_order,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsRename = valLocals('stepsRename', {
  user_id: string.require(),
  goal_id: string.require(),
  step_id: string.require(),
  title: string.require().min(1),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
    title,
  } = res.locals;

  dbStepsRename({ user_id, goal_id, step_id, title })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsDelete = valLocals('stepsDelete', {
  user_id: string.require(),
  goal_id: string.require(),
  step_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
  } = res.locals;

  dbStepsDelete({ user_id, goal_id, step_id })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsReorder = valLocals('stepsReorder', {
  user_id: string.require(),
  goal_id: string.require(),
  step_order: array.of(string).require(),
  current_step_id: string.require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_order,
    current_step_id,
  } = res.locals;

  dbStepsReorder({ user_id, goal_id, step_order, current_step_id })
    .then((results) => {
      const changes = results.changes[0];
      let status = {};

      if (changes) {
        status = changes.new_val.status;
      }

      setLocals({
        status,
      });

      return next();
    })
    .catch((err) => {
      return next(err);
    });
});
const stepsAssign = valLocals('stepsAssign', {
  user_id: string.require(),
  goal_id: string.require(),
  step_id: string.require(),
  assignees: array.of(string).require(),
}, (req, res, next, setLocals) => {
  const {
    user_id,
    goal_id,
    step_id,
    assignees,
  } = res.locals;

  dbStepsAssign({ user_id, goal_id, step_id, assignees })
    .then(() => {
      return next();
    })
    .catch((err) => {
      return next(err);
    });
});

export {
  stepsAdd,
  stepsRename,
  stepsDelete,
  stepsReorder,
  stepsAssign,
};
