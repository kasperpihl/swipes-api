import * as types from 'constants';
import * as ca from 'swipes-core-js/actions';
import * as a from './';


export const setMaximized = toggle => ({ type: types.SET_MAXIMIZED, payload: { toggle } });
export const setFullscreen = toggle => ({ type: types.SET_FULLSCREEN, payload: { toggle } });

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
// Context Menu
// ======================================================
export const contextMenu = payload => (dp, getState) => {
  const cMenu = getState().getIn(['main', 'contextMenu']);
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
  if (!getState().getIn(['globals', 'isElectron'])) {
    return window.open(url);
  }
  return dp(a.navigation.openSecondary(from, {
    id: 'Browser',
    showTitleInCrumb: true,
    title: 'Browser',
    props: {
      url,
      onLoad,
    },
  }));
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
export const forceLogout = () => {
  window.analytics.logout();
  localStorage.clear();
  window.location.replace('/');
};
export const signout = cb => dp => dp(ca.api.request('users.signout')).then((res) => {
  if (cb) {
    cb(res);
  }
  if (res && res.ok) {
    dp(forceLogout);
  }
});


// ======================================================
// Search
// ======================================================
export const search = query => (dp) => {
  dp({ type: types.SEARCH, query });
  if (!query || !query.length) {
    return dp({ type: types.SEARCH_RESULTS, result: null });
  }
  return dp(ca.api.request('search', { q: query })).then((res) => {
    if (res && res.ok) {
      dp({ type: types.SEARCH_RESULTS, result: res.mappedResults });
    } else {
      dp({ type: types.SEARCH_ERROR });
    }
  });
};
