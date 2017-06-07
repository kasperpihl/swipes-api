import * as types from '../constants';
import { fromJS, Map } from 'immutable';
import { reducerInitToMap } from '../classes/utils';

const initialState = fromJS({});

export default function onboarding(state = initialState, action) {
  const { payload, type } = action;
  switch (action.type) {
    case 'init': {
      return reducerInitToMap(payload, 'onboarding', state);;
    }
    default:
      return state;
  }
}
