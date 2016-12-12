import * as types from '../constants/ActionTypes';
import { fromJS } from 'immutable';
const initialState = fromJS({});

export default function notes(state = initialState, action) {
  switch (action.type) {
    case 'rtm.start': {
      return state;
    }
    case types.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
