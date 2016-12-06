import * as types from 'constants';
import { randomString } from 'classes/utils';

export function remove(toastId) {
  return { type: types.TOAST_REMOVE, toastId };
}

const handleDuration = (dispatch, duration, toastId) => {
  if (typeof duration === 'number' && duration > 0) {
    setTimeout(() => {
      dispatch(remove(toastId));
    }, duration);
  }
};

export function add(toast) {
  const newToast = toast;

  return (dispatch) => {
    const toastId = randomString(6);

    newToast.id = toastId;
    dispatch({ type: types.TOAST_ADD, newToast, toastId });
    handleDuration(dispatch, newToast.duration, toastId);

    return Promise.resolve(toastId);
  };
}
export function update(toastId, toast) {
  return (dispatch) => {
    dispatch({ type: types.TOAST_UPDATE, toastId, toast });
    handleDuration(dispatch, toast.duration, toastId);
  };
}
