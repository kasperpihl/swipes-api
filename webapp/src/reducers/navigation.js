import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({
  primary: {
    id: null,
    stack: [],
  },
  secondary: {
    id: null,
    stack: [],
  },
  counters: {},
});

export default function history(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.NAVIGATION_SET: {
      return state.update((s) => {
        s = s.setIn([payload.target, 'id'], payload.id);
        return s.setIn([payload.target, 'stack'], fromJS(payload.stack));
      });
    }
    case types.NAVIGATION_SAVE_STATE: {
      return state.updateIn([
        payload.target,
        'stack',
        (state.getIn([payload.target, 'stack']).size - 1),
      ], s => s.setIn(['props', 'savedState'], fromJS(payload.savedState)));
    }
    case types.NAVIGATION_PUSH: {
      return state.updateIn([payload.target, 'stack'], s => s.push(fromJS(payload.obj)));
    }
    case types.NAVIGATION_POP: {
      return state.updateIn([payload.target, 'stack'], (s) => {
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
