import * as types from 'constants';
import * as a from './';

export const setStatus = status => ({ type: types.SET_STATUS, status });

// ======================================================
// Simple persistent cache
// ======================================================
export const cache = {
  save: (index, data) => ({ type: types.CACHE_SAVE, payload: { index, data } }),
  remove: index => ({ type: types.CACHE_REMOVE, index }),
  clear: () => ({ type: types.CACHE_CLEAR }),
};

// ======================================================
// Overlays
// ======================================================
export const overlay = payload => ({ type: types.OVERLAY, payload });

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
// Update Recent
// ======================================================
export const updateRecentAssignees = payload => ({ type: types.UPDATE_RECENT_ASSIGNEES, payload });

// ======================================================
// Title
// ======================================================
export const preview = pre => (dp) => {
  if (!pre) {
    return dp({ type: types.PREVIEW, payload: null });
  }
  let endpoint = 'link.preview';
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
      dp({ type: types.PREVIEW, payload: res.preview });
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
  localStorage.clear();
  dp({ type: types.LOGOUT });
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
  save: (oId, id, text, unlock) => dp => dp(a.api.request('notes.save', {
    organization_id: oId,
    id,
    text,
    unlock,
  })),
  show: id => ({ type: types.NOTE_SHOW, payload: { id },
  }),
  hide: () => ({ type: types.NOTE_HIDE }),
};


// ======================================================
// Search
// ======================================================
export const search = query => (dp) => {
  dp({ type: types.SEARCH, query });
  dp(a.api.request('search', { q: query })).then((res) => {
    if (res && res.ok) {
      dp({ type: types.SEARCH_RESULTS, result: res.result });
    } else {
      dp({ type: types.SEARCH_ERROR });
    }
  });
};
