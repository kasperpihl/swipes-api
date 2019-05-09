import * as types from '../constants';

function ensureUniqueId(screen) {
  if (screen) {
    screen.uniqueId =
      screen.uniqueId ||
      Math.random()
        .toString(36)
        .substring(7);
  }
}

export const redirectTo = (url, options) => (d, getState) => {
  if (getState().navigation.get('url') === url) return;
  d({ type: types.NAV_URL, payload: { url, options } });
};

export function set(side, screen) {
  ensureUniqueId(screen);
  const payload = { side };
  if (screen) {
    payload.screen = screen;
  }
  if (payload.target === 'left') {
    payload.sideMenuId = screen.screenId;
  }
  return { type: types.NAV_SET, payload };
}

export function reset() {
  return { type: types.NAV_RESET };
}

export function saveState(side, savedState) {
  const payload = { savedState, side };
  return { type: types.NAV_SAVE_STATE, payload };
}

export function toggleLock(side) {
  return { type: types.NAV_TOGGLE_LOCK, payload: { side } };
}

export function push(side, screen) {
  ensureUniqueId(screen);
  const payload = { screen, side };
  return { type: types.NAV_PUSH, payload };
}

export function focus(side) {
  return { type: types.NAV_FOCUS, payload: { side } };
}

export const openRight = (fromSide, screen) => (d, getState) => {
  ensureUniqueId(screen);
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
