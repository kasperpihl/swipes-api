import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  index: 1,
});

export default function navigation(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.NAVIGATION_CHANGE: {
      return state.set('index', payload.index)
    }
    default:
      return state;
  }
}
