import * as types from '../constants';
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
export function modal(target, component, props) {
  return {
    type: types.NAVIGATION_MODAL,
    payload: { target, component, props }
  };
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
  if (!payload) {
    return hideContextMenu()(dp, getState);
  }
  dp({ type: types.CONTEXT_MENU, payload });
};

export const hideContextMenu = (...args) => (dp, getState) => {
  const cMenu = getState().main.get('contextMenu');
  if (cMenu && typeof cMenu.onClose === 'function') {
    cMenu.onClose(...args);
  }
  if (cMenu && cMenu.props && typeof cMenu.props.onClose === 'function') {
    cMenu.props.onClose(...args);
  }
  dp({ type: types.CONTEXT_MENU, payload: null });
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
