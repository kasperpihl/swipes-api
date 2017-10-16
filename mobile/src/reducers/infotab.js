import { fromJS, Map } from 'immutable';
import * as types from 'constants/ActionTypes';

const initialState = fromJS({
});

export default function infoTab (state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.SHOW_INFOTAB: {
      return Map(payload);
    }
    case types.RESET_STATE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
