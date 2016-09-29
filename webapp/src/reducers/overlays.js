import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'

const initialState = fromJS([]);

export default function modal (state = initialState, action) {
  switch (action.type) {
    case types.SET_OVERLAY:{
      return state.clear().push(fromJS(action.overlay));
    }
    case types.PUSH_OVERLAY:{
      return state.push(fromJS(action.overlay));
    }
    case types.CLEAR_OVERLAY:{
      if(typeof action.index === 'number'){
        return state.slice(0, action.index + 1);
      }
      return state.clear();
    }
    case types.LOGOUT:
      return initialState;
    default: 
      return state
  }
}