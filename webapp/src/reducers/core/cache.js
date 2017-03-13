import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {

    // ======================================================
    // Caching
    // ======================================================
    case types.CACHE_SAVE: {
      return state.set(payload.index, payload.data);
    }
    case types.CACHE_REMOVE: {
      return state.delete(payload.index);
    }
    case types.CACHE_CLEAR: {
      return state.set(initialState);
    }

    default:
      return state;
  }
}
