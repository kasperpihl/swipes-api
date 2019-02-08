import * as types from '../constants';

export const redirectTo = (url, options) => (d, getState) => {
  if (getState().navigation.get('url') === url) return;
  d({ type: types.NAV_URL, payload: { url, options } });
};

export function set(side, screen) {
  const payload = { side };
  if (screen) {
    payload.screen = screen;
  }
  if (payload.target === 'primary') {
    payload.sideMenuId = screen.screenId;
  }
  return { type: types.NAV_SET, payload };
}

export function setUniqueId(side, uniqueId) {
  return { type: types.NAV_SET_UNIQUE_ID, payload: { side, uniqueId } };
}

export function saveState(side, savedState) {
  const payload = { savedState, side };
  return { type: types.NAV_SAVE_STATE, payload };
}

export function toggleLock(side) {
  return { type: types.NAV_TOGGLE_LOCK, payload: { side } };
}

export function push(side, screen) {
  const payload = { screen, side };
  return { type: types.NAV_PUSH, payload };
}

export function focus(side) {
  return { type: types.NAV_FOCUS, payload: { side } };
}

export const openRight = (fromSide, screen) => (d, getState) => {
  const navState = getState().navigation;

  const isLocked = navState.get('locked');
  let toSide = 'right';
  if (isLocked) {
    toSide = 'left';
  }
  const leftCurrent = navState.get('left').last();
  if (
    leftCurrent.get('uniqueId') &&
    leftCurrent.get('uniqueId') === screen.uniqueId
  ) {
    return d(focus('left'));
  }

  if (fromSide === 'left' && !isLocked) {
    return d(set('right', screen));
  }
  return d(push(toSide, screen));
};

export function pop(side, i) {
  const payload = { side };
  if (typeof i === 'number') {
    payload.index = Math.max(parseInt(i, 10), 0);
  }
  return { type: types.NAV_POP, payload };
}
