import { fromJS, Map } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({});

export default function notesReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case 'rtm.start': {
      if (payload.ok) {
        let server = Map();
        payload.notes.forEach((note) => {
          server = server.set(note.id, Map(note));
        });
        return state.set('server', server);
      }
      return state;
    }
    case types.NOTE_CACHE: {
      if (payload.serverOrg) {
        state = state.setIn(['cache', payload.id, 'serverOrg'], payload.serverOrg);
      }
      return state.setIn(['cache', payload.id, 'text'], payload.text);
    }
    case types.NOTE_SAVE_START: {
      state = state.setIn(['cache', payload.id, '_savingText'], payload.text);
      return state.deleteIn(['cache', payload.id, 'text']);
    }
    case types.NOTE_SAVE_SUCCESS: {
      const id = payload.id;
      const note = Map(payload.note);
      if (state.getIn(['server', id, 'rev']) < note.get('rev')) {
        state = state.setIn(['server', id], note);
      }
      if (state.getIn(['cache', id, 'text'])) {
        state = state.setIn(['cache', id, 'serverOrg'], note);
        return state.deleteIn(['cache', id, '_savingText']);
      }

      return state.deleteIn(['cache', id]);
    }
    case types.NOTE_SAVE_ERROR: {
      const id = payload.id;
      console.log(payload.error);
      if (payload.error && payload.error.message === 'merge_needed') {
        const note = payload.error.note;
        if (state.getIn(['server', id, 'rev']) < note.rev) {
          state = state.setIn(['server', id], note);
        }
      }
      const oldText = state.getIn(['cache', id, '_savingText']);
      if (!state.getIn(['cache', id, 'text'])) {
        state = state.setIn(['cache', id, 'text'], oldText);
      }
      return state.deleteIn(['cache', id, '_savingText']);
    }
    case 'note_updated': {
      if (state.getIn(['server', payload.id, 'rev']) < payload.rev) {
        return state.setIn(['server', payload.id], Map(payload));
      }
      return state;
    }
    default:
      return state;
  }
}
