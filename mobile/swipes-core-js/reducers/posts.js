import * as types from 'constants'
import { fromJS } from 'immutable'
import { reducerInitToMap } from '../classes/utils';
const initialState = fromJS({});

export default function posts (state = initialState, action) {
  const { payload, type } = action;
  switch (action.type) {
    case 'init': {
      return reducerInitToMap(payload, 'posts', state);
    }
    default:
      return state
  }
}
