import * as types from '../constants';
import request from 'swipes-core-js/utils/request';
import * as coreTypes from 'swipes-core-js/redux/constants';
import * as navigationActions from '../navigation/navigationActions';

export const setMaximized = toggle => ({
  type: types.SET_MAXIMIZED,
  payload: { toggle }
});
export const setFullscreen = toggle => ({
  type: types.SET_FULLSCREEN,
  payload: { toggle }
});

// ======================================================
// Tooltips
// ======================================================
export const tooltip = payload => ({ type: types.TOOLTIP, payload });

// ======================================================
// Modal
// ======================================================
export function modal(target, modal) {
  return { type: types.NAVIGATION_MODAL, payload: { modal, target } };
}
// ======================================================
// DragAndDrop
// ======================================================
export function subscribeToDrop(target, handler, title) {
  return {
    type: types.SUBSCRIBE_TO_DROP,
    payload: {
      handler,
      target,
      title
    }
  };
}

export function unsubscribeFromDrop(target, handler) {
  return {
    type: types.UNSUBSCRIBE_FROM_DROP,
    payload: {
      target,
      handler
    }
  };
}
// ======================================================
// Context Menu
// ======================================================
export const contextMenu = payload => (dp, getState) => {
  const cMenu = getState().main.get('contextMenu');
  if (cMenu && typeof cMenu.onClose === 'function') {
    cMenu.onClose();
  }
  if (cMenu && cMenu.props && typeof cMenu.props.onClose === 'function') {
    cMenu.props.onClose();
  }
  dp({ type: types.CONTEXT_MENU, payload });
};

// ======================================================
// Browser
// ======================================================
export const browser = (from, url, onLoad) => (dp, getState) => {
  if (!getState().global.get('isElectron')) {
    return window.open(url);
  }
  return dp(
    navigationActions.openSecondary(from, {
      id: 'Browser',
      showTitleInCrumb: true,
      title: 'Browser',
      props: {
        url,
        onLoad
      }
    })
  );
};

// ======================================================
// Success gradient
// ======================================================
export function successGradient(color) {
  return { type: types.SUCCESS_GRADIENT, payload: { color } };
}

// ======================================================
// Account related
// ======================================================
export const forceLogout = dp => {
  window.analytics.logout();
  dp({ type: coreTypes.RESET_STATE });
};

export const signout = cb => dp =>
  request('users.signout').then(res => {
    if (cb) {
      cb(res);
    }
    if (res && res.ok) {
      dp(forceLogout);
    }
  });
