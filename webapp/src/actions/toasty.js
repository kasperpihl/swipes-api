import * as types from '../constants/ActionTypes'
import { randomString } from '../classes/utils'

const handleDuration = (dispatch, duration, toastId) => {
  if(typeof duration === 'number' && duration > 0){
    setTimeout(() => {
      dispatch(remove(toastId));
    }, duration)
  }
};

export function add(toast){
  return (dispatch, getState) => {
    const toastId = randomString(6);
    toast.id = toastId;
    dispatch({ type: types.TOAST_ADD, toast, toastId });
    handleDuration(dispatch, toast.duration, toastId);
    return Promise.resolve(toastId);
  }
}
export function update(toastId, toast) {
  return (dispatch, getState) => {
    dispatch({ type: types.TOAST_UPDATE, toastId, toast });
    handleDuration(dispatch, toast.duration, toastId);
  }
  
}

export function remove(toastId) {
  return { type: types.TOAST_REMOVE, toastId };
}

