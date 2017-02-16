import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({
  id: null,
  primary: [],
  secondary: [],
  history: {},
  counters: {},
});

export default function history(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.NAVIGATION_SET: {
      return state.update((s) => {
        if (payload.target === 'primary') {
          s = s.setIn(['history', s.getIn(['id'])], s.getIn(['primary']));
          s = s.set('id', payload.id);
        }
        return s.set(payload.target, fromJS(payload.stack || []));
      });
    }
    case types.NAVIGATION_SAVE_STATE: {
      return state.updateIn([
        payload.target,
        (state.get(payload.target).size - 1),
      ], s => s.set('savedState', payload.savedState));
    }
    case types.NAVIGATION_PUSH: {
      return state.updateIn([payload.target], s => s.push(fromJS(payload.obj)));
    }
    case types.NAVIGATION_POP: {
      return state.updateIn([payload.target], (s) => {
        if (payload && typeof payload.index === 'number') {
          return s.slice(0, payload.index + 1);
        }
        return s.butLast();
      });
    }
    case types.NAVIGATION_SET_COUNTER: {
      const { id, counter } = payload;
      return state.setIn(['counters', id], `${counter}`);
    }
    case types.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
