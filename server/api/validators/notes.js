import {
  validatorMiddleware,
} from './validation-wrapper';

const organization_id = {
  presence: true,
};
const goal_id = {
  presence: true,
};
const text = {
  presence: true,
};
const validateNotesSave = validatorMiddleware({
  organization_id,
  goal_id,
  text,
});

export {
  validateNotesSave,
};
