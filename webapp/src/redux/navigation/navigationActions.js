import * as types from '../constants';

export const redirectTo = (url, options) => (d, getState) => {
  if (getState().navigation.get('url') === url) return;
  d({ type: types.NAV_URL, payload: { url, options } });
};

export function setOnTop(side) {
  return { type: types.NAV_SET_ON_TOP, payload: { side } };
}

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
export const openSecondary = (fromSide, screen) => (d, getState) => {
  const isLocked = getState().navigation.get('locked');
  if (isLocked) {
    return d(push('left', screen));
  }
  if (fromSide === 'left') {
    return d(set('right', screen));
  }
  return d(push('right', screen));
};

export function pop(side, i) {
  const payload = { side };
  if (typeof i === 'number') {
    payload.index = Math.max(parseInt(i, 10), 0);
  }
  return { type: types.NAV_POP, payload };
}
