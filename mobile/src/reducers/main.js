import { fromJS, Map } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import * as types from 'constants/ActionTypes';

const initialState = fromJS({
  overlay: null,
  isHydrated: false,
  versionInfo: {},
});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case REHYDRATE: {
      return state.set('isHydrated', true);
    }
    default: {
      return state;
    }
  }
}
