import { fromJS, Map } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import * as types from 'constants/ActionTypes';

const initialState = fromJS({
  modal: null,
  isHydrated: false,
});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case REHYDRATE: {
      return state.set('isHydrated', true);
    }
    case types.SHOW_MODAL: {
      return state.set('modal', payload || null);
    }
    default: {
      return state;
    }
  }
}
