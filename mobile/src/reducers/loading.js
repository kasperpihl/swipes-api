import { fromJS, Map } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  loading: false,
});

export default function loading(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.SHOW_LOADER: {
      return state.set('loading', payload);
    }
    default:
      return state;
  }
}
