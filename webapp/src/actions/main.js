import * as types from 'constants';
import {
  convertToRaw,
  EditorState,
} from 'draft-js';
import * as a from './';

export const setStatus = (status, nextRetry) => ({
  type: types.SET_STATUS,
  payload: { status, nextRetry },
});
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
// Update Recent
// ======================================================
export const updateRecentAssignees = payload => ({ type: types.UPDATE_RECENT_ASSIGNEES, payload });

// ======================================================
// Browser
// ======================================================
export const browser = (from, url, onLoad) => dp => dp(a.navigation.openSecondary(from, {
  id: 'Browser',
  props: {
    url,
    onLoad,
  },
}));

// ======================================================
// Account related
// ======================================================
export const logout = cb => dp => dp(a.api.request('users.signout')).then((res) => {
  if (cb) {
    cb(res);
  }
  if (res && res.ok) {
    dp({ type: types.LOGOUT });
  }
});

// ======================================================
// Notes
// ======================================================
export const note = {
  create: (oId, text) => dp => dp(a.api.request('notes.create', {
    organization_id: oId,
    text: text || convertToRaw(EditorState.createEmpty().getCurrentContent()),
  })),
  save: (oId, id, text, rev) => dp => dp(a.api.request('notes.save', {
    organization_id: oId,
    id,
    text,
    rev,
  })),
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
