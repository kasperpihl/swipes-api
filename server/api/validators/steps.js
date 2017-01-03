import {
  validatorMiddleware,
} from './validation-wrapper';

const goal_id = {
  presence: true,
};
const step_id = {
  presence: true,
};
const payload = {
  presence: true,
};
const validateStepsSubmit = validatorMiddleware({
  goal_id,
});
const validateStepsUpdate = validatorMiddleware({
  goal_id,
  step_id,
  payload,
});

export {
  validateStepsSubmit,
  validateStepsUpdate,
};
