import * as types from 'constants';
import * as a from './';

export const setStatus = (status, nextRetry) => ({
  type: types.SET_STATUS,
  payload: { status, nextRetry },
});
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
// Mark notifications as read
// ======================================================
export const markNotifications = payload => (dp) => {
  if (typeof payload === 'string') {
    return dp(a.api.request('notifications.markAsSeen.ts', {
      timestamp: payload,
    }));
  } else if (Array.isArray(payload)) {
    return dp(a.api.request('notifications.markAsSeen.ids', {
      notification_ids: payload,
    }));
  }
  return Promise.resolve();
};

// ======================================================
// Open slack in a users page
// ======================================================
export const openSlackIn = id => ({ type: types.SLACK_OPEN_IN, payload: { id } });

// ======================================================
// Browser
// ======================================================
export const browser = (from, url, onLoad) => dp => dp(a.navigation.openSecondary(from, {
  id: 'Browser',
  showTitleInCrumb: true,
  title: 'Browser',
  props: {
    url,
    onLoad,
  },
}));

// ======================================================
// Account related
// ======================================================
export const forceLogout = () => {
  window.analytics.logout();
  localStorage.clear();
  window.location.replace('/');
};
export const signout = cb => dp => dp(a.api.request('users.signout')).then((res) => {
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
  return dp(a.api.request('search', { q: query })).then((res) => {
    if (res && res.ok) {
      dp({ type: types.SEARCH_RESULTS, result: res.mappedResults });
    } else {
      dp({ type: types.SEARCH_ERROR });
    }
  });
};
