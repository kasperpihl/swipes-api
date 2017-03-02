import { fromJS } from 'immutable';

const initialState = fromJS({});

export default function notesReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case 'rtm.start': {
      if (payload.ok) {
        const notes = {};
        payload.notes.forEach((note) => {
          notes[note.id] = note;
        });
        return fromJS(notes);
      }
      return state;
    }
    case 'note_updated': {
      return state.set(payload.id, fromJS(payload));
    }
    default:
      return state;
  }
}
