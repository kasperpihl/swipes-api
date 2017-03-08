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
    case 'notes.save': {
      return state.set(payload.note.id, fromJS(payload.note));
    }
    case 'note_updated': {
      return state.set(payload.id, fromJS(payload));
    }
    default:
      return state;
  }
}
