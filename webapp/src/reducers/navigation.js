import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({
  primary: {
    id: null,
    history: {},
  },
  secondary: {
    id: null,
    history: {},
  },
  counters: {},
});

export default function history(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.NAVIGATION_SET: {
      return state.update((s) => {
        s = s.setIn([payload.target, 'id'], payload.id);
        if (payload.history) {
          s = s.setIn([payload.target, 'history', payload.id], fromJS(payload.history));
        }
        return s;
      });
    }
    case types.NAVIGATION_PUSH: {
      const currentId = state.getIn([payload.target, 'id']);
      return state.updateIn([payload.target, 'history', currentId], (s) => {
        const { savedState } = payload;
        if (savedState) {
          s = s.mergeIn([s.size - 1], fromJS({ savedState }));
        }
        return s.push(fromJS(payload.obj));
      });
    }
    case types.NAVIGATION_POP: {
      const currentId = state.getIn([payload.target, 'id']);
      return state.updateIn([payload.target, 'history', currentId], (s) => {
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
