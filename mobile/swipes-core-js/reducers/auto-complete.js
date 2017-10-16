import * as types from '../constants'
import { fromJS } from 'immutable'
const initialState = fromJS({
  string: null,
  options: {},
});

export default function autoComplete (state = initialState, action) {
  const {
    type,
    payload,
  } = action;
  switch (type) {
    case types.AUTO_COMPLETE: {
      return state.merge(payload);
    }
    case types.AUTO_COMPLETE_CLEAR:
    case types.RESET_STATE: {
      return initialState;
    }
    default:{
      return state;
    }
  }
}
