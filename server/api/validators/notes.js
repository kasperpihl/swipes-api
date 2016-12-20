import {
  validatorMiddleware,
} from './validation-wrapper';
// import {
//   isBooleanOptinal,
// } from './common';

const organization_id = {
  presence: true,
};
const id = {
  presence: true,
};
const text = {

};
const title = {

};
const unlock = {

};


// const unlock = Object.assign({}, isBooleanOptinal, {
//   presence: {
//     allowEmpty: true,
//   },
// });
const notesSaveConstraints = Object.assign({}, {
  organization_id,
  id,
  text,
  title,
  unlock,
  // T__TODO figure out how we can validate optional attributes
  // unlock,
});

const notesCreateConstraints = Object.assign({}, {
  organization_id,
  // T__TODO figure out how we can validate optional attributes
  // unlock,
});

const validateNotesSave = validatorMiddleware(notesSaveConstraints);
const validateNotesCreate = validatorMiddleware(notesCreateConstraints);
export {
  validateNotesSave,
  validateNotesCreate,
};
