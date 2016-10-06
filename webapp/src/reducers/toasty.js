import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'
const initialState = fromJS({});

export default function toasty (state = initialState, action) {
  switch (action.type) {
    case types.TOAST_UPDATE:
    case types.TOAST_ADD:{
      const { toast, toastId } = action;
      return state.set(toastId, toast)
    }
    case types.TOAST_REMOVE:{
      const { toastId } = action;
      return state.delete(toastId);
    }
    case types.LOGOUT:{
      return initialState;
    }
    default: 
      return state
  }
}