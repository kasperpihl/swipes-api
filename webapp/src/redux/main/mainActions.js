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
    type: types.NAV_MODAL,
    payload: { target, component, props }
  };
}

export function sidebarSetExpanded(sidebarExpanded) {
  return function(dispatch, getState) {
    const currIsExpanded = getState().main.get('sidebarExpanded');
    if (sidebarExpanded !== currIsExpanded) {
      dispatch({
        type: types.SIDEBAR_SET_EXPANDED,
        payload: { sidebarExpanded }
      });
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
    navigationActions.openRight(from, {
      screenId: 'Browser',
      showTitleInCrumb: true,
      crumbTitle: 'Browser',
      props: {
        url,
        onLoad
      }
    })
  );
};
