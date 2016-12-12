import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

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
          notes[note.goal_id] = note;
        });
        return fromJS(notes);
      }
      return state;
    }
    case 'note_updated': {
      return state.set(payload.goal_id, fromJS(payload));
    }
    case types.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
