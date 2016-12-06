import * as types from '../constants/ActionTypes';
import { fromJS } from 'immutable';
const initialState = fromJS({
  currentId: null,
  histories: {

  },
});

export default function history(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'rtm.start': {
      return state;
    }
    case types.NAVIGATION_SET: {
      return state.clear().push(fromJS(action.overlay));
    }
    case types.NAVIGATION_PUSH: {
      return state.push(fromJS(action.overlay));
    }
    case types.NAVIGATION_POP: {
      return state.butLast();
    }
    case types.NAVIGATION_POP_TO: {
      if (typeof action.index === 'number') {
        return state.slice(0, action.index + 1);
      }
      return state.clear();
    }
    case types.NAVIGATION_POP_TO_ROOT: {
      if (typeof action.index === 'number') {
        return state.slice(0, action.index + 1);
      }
      return state.clear();
    }
    case types.LOGOUT:
      return initialState;
    default:
      return state;
  }
}
