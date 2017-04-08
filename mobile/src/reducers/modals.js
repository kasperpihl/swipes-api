import { fromJS, Map } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  modal: {},
});

export default function modals(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.SHOW_MODAL: {
      return state.set('modal', Map(payload));
    }
    default:
      return state;
  }
}
