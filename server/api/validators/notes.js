import {
  validatorMiddleware,
} from './validation-wrapper';
// import {
//   isBooleanOptinal,
// } from './common';

const organization_id = {
  presence: true,
};
const goal_id = {
  presence: true,
};
const text = {
  presence: true,
};
// const unlock = Object.assign({}, isBooleanOptinal, {
//   presence: {
//     allowEmpty: true,
//   },
// });
const notesSaveConstraints = Object.assign({}, {
  organization_id,
  goal_id,
  text,
  // T__TODO figure out how we can validate optional attributes
  // unlock,
});
const validateNotesSave = validatorMiddleware(notesSaveConstraints);

export {
  validateNotesSave,
};
