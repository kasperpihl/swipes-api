import * as types from '../constants';
import { randomString } from 'swipes-core-js/classes/utils';

export const url = (url, options) => (d, getState) => {
  if(getState().getIn(['navigation', 'url']) === url) return;
  d({ type: types.NAVIGATION_URL, payload: { url, options } });
}

export function set(target, obj) {
  return (dispatch, getState) => {
    const isLocked = getState().getIn(['navigation', 'locked']);
    target = isLocked ? 'primary' : target;
    const payload = {
      id: target === 'primary' ? obj.id : randomString(5),
      target,
      stack: obj ? [obj] : [],
    };
    dispatch({ type: types.NAVIGATION_SET, payload });
  };
}

export function saveState(target, savedState) {
  const payload = { savedState, target };
  return { type: types.NAVIGATION_SAVE_STATE, payload };
}

export function toggleLock() {
  return { type: types.NAVIGATION_TOGGLE_LOCK };
}

export function push(target, obj) {
  const payload = { obj, target };
  return { type: types.NAVIGATION_PUSH, payload };
}
export const openSecondary = (from, obj) => (d, getState) => {
  const isLocked = getState().getIn(['navigation', 'locked']);
  if (isLocked) {
    return d(push('primary', obj));
  }
  if (from === 'primary') {
    return d(set('secondary', obj));
  }
  return d(push('secondary', obj));
};

export function pop(target, i) {
  const payload = { target };
  if (typeof i !== 'undefined') {
    payload.index = Math.max(parseInt(i, 10), 0);
  }
  return { type: types.NAVIGATION_POP, payload };
}
