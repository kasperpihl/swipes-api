import * as types from 'constants';
import * as a from './';

export const setStatus = (status, nextRetry) => ({
  type: types.SET_STATUS,
  payload: { status, nextRetry,
  } });
export const setMaximized = toggle => ({ type: types.SET_MAXIMIZED, payload: { toggle } });
export const setFullscreen = toggle => ({ type: types.SET_FULLSCREEN, payload: { toggle } });

// ======================================================
// Simple persistent cache
// ======================================================
export const cache = {
  save: (index, data) => ({ type: types.CACHE_SAVE, payload: { index, data } }),
  remove: index => ({ type: types.CACHE_REMOVE, payload: { index } }),
  clear: () => ({ type: types.CACHE_CLEAR }),
};

export const setSlackUrl = url => ({ type: types.SET_SLACK_URL, payload: { url } });

// ======================================================
// Overlays
// ======================================================
export const overlay = payload => ({ type: types.OVERLAY, payload });

// ======================================================
// Modal
// ======================================================
export const modal = (props, callback) => ({ type: types.MODAL, payload: { props, callback } });

// ======================================================
// Context Menu
// ======================================================
export const contextMenu = payload => (dp, getState) => {
  const cMenu = getState().getIn(['main', 'contextMenu']);
  if (!payload && cMenu && typeof cMenu.onClose === 'function') {
    cMenu.onClose();
  }
  dp({ type: types.CONTEXT_MENU, payload });
};

// ======================================================
// Mark notifications as read
// ======================================================
export const markNotifications = timestamp => dp => dp(a.api.request('notifications.markAsSeen', {
  timestamp,
}));

// ======================================================
// Open slack in a users page
// ======================================================
export const openSlackIn = id => ({ type: types.SLACK_OPEN_IN, payload: { id } });

// ======================================================
// Update Recent
// ======================================================
export const updateRecentAssignees = payload => ({ type: types.UPDATE_RECENT_ASSIGNEES, payload });

// ======================================================
// Title
// ======================================================
export const preview = (pre, options) => (dp) => {
  if (!pre) {
    return dp({ type: types.PREVIEW, payload: null });
  }
  let endpoint = 'links.preview';
  let params = {
    short_url: pre,
  };
  if (typeof pre === 'object') {
    endpoint = 'find.preview';
    params = pre;
  }
  dp({ type: types.PREVIEW_LOADING });
  return dp(a.api.request(endpoint, params)).then((res) => {
    if (res && res.ok) {
      dp({ type: types.PREVIEW, payload: { object: res.preview, options } });
    } else {
      console.warn('Preview error', pre);
    }
  });
};

// ======================================================
// Browser
// ======================================================
export const browser = (url, onLoad) => overlay({
  component: 'Browser',
  hideClose: true,
  props: {
    url,
    onLoad,
  },
});

// ======================================================
// Account related
// ======================================================
export const logout = () => (dp) => {
  dp({ type: types.LOGOUT });
  localStorage.clear();
  window.location.replace('/');
};

// ======================================================
// Notes
// ======================================================
export const note = {
  create: (oId, title) => dp => dp(a.api.request('notes.create', {
    organization_id: oId,
    title,
  })),
  save: (oId, id, text, unlock) => (dp) => {
    dp(a.api.request('notes.save', {
      organization_id: oId,
      id,
      text,
      unlock,
    }));
  },
  show: id => ({ type: types.NOTE_SHOW, payload: { id },
  }),
  hide: () => ({ type: types.NOTE_HIDE }),
};


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
