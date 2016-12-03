import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  shown: false,
});

export default function modal(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_MODAL: {
      const props = action.props || {};
      const type = action.modalType;

      return state.update(ns => ns.set('shown', true).set('type', type).set('props', props).set('callback', action.callback || null));
    }
    case types.HIDE_MODAL: {
      return initialState;
    }
    default:
      return state;
  }
}
