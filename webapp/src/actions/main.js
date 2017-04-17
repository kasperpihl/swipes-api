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
// Context Menu
// ======================================================
export const contextMenu = payload => (dp, getState) => {
  const cMenu = getState().getIn(['main', 'contextMenu']);
  if (!payload && cMenu) {
    const { onClose, props } = cMenu;
    if (typeof onClose === 'function') {
      onClose();
    } else if (props && typeof props.onClose === 'function') {
      props.onClose();
    }
  }
  dp({ type: types.CONTEXT_MENU, payload });
};

// ======================================================
// Open slack in a users page
// ======================================================
export const openSlackIn = id => ({ type: types.SLACK_OPEN_IN, payload: { id } });

// ======================================================
// Browser
// ======================================================
export const browser = (from, url, onLoad) => (dp) => {
  if(!window.ipcListener.isElectron){
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
  }))

};

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
