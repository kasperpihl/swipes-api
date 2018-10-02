import { fromJS } from 'immutable';
import { REHYDRATE } from 'redux-persist';
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
    case types.SET_LOADING: {
      return state.set('loading', payload || null);
    }
    case types.RESET_STATE: {
      return initialState.set('isHydrated', state.get('isHydrated'));
    }
    default: {
      return state;
    }
  }
}
