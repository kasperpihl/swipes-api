import {
  validatorMiddleware,
} from './validation-wrapper';

const goal_id = {
  presence: true,
};
const goal = {
  presence: true,
};
const organization_id = {
  presence: true,
};
const workflow_id = {
  presence: true,
};
const validateGoalsCreate = validatorMiddleware({
  goal,
  organization_id,
  workflow_id,
});
const validateGoalsDelete = validatorMiddleware({ goal_id });

export {
  validateGoalsCreate,
  validateGoalsDelete,
};
