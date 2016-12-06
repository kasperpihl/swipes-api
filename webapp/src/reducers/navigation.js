import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  id: null,
  history: {},
});

export default function history(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.NAVIGATION_SET: {
      return state.update((s) => {
        s = s.set('id', payload.id);
        if (payload.history) {
          s = s.setIn(['history', payload.id], fromJS(payload.history));
        }
        return s;
      });
    }
    case types.NAVIGATION_PUSH: {
      return state.updateIn(['history', state.get('id')], s => s.push(fromJS(payload.obj)));
    }
    case types.NAVIGATION_POP: {
      return state.updateIn(['history', state.get('id')], (s) => {
        if (payload && typeof payload.index === 'number') {
          return s.slice(0, payload.index + 1);
        }
        return s.butLast();
      });
    }
    case types.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
