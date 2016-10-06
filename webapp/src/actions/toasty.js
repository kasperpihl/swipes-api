import * as types from '../constants/ActionTypes'
import { randomString } from '../classes/utils'

export function add(toast){
  return (dispatch, getState) => {
    const toastId = randomString(6);
    toast.id = toastId;
    dispatch({ type: types.TOAST_ADD, toast, toastId });
    if(toast.duration > 0){
      setTimeout(() => {
        dispatch(remove(toastId));
      }, toast.duration)
    }
    return Promise.resolve(toastId);
  }
}
export function update(toastId, toast) {
  return (dispatch, getState) => {
    dispatch({ type: types.TOAST_UPDATE, toastId, toast });
    if(toast.duration > 0){
      setTimeout(() => {
        dispatch(remove(toastId));
      }, toast.duration)
    }
  }
  
}

export function remove(toastId) {
  return { type: types.TOAST_REMOVE, toastId };
}

