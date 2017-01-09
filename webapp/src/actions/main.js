import * as types from 'constants';
import { request } from './api';

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
export const contextMenu = payload => ({ type: types.CONTEXT_MENU, payload });


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
  create: (oId, title) => dp => dp(request('notes.create', {
    organization_id: oId,
    title,
  })),
  save: (oId, id, text, unlock) => dp => dp(request('notes.save', {
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
  dp(request('search', { q: query })).then((res) => {
    if (res && res.ok) {
      dp({ type: types.SEARCH_RESULTS, result: res.result });
    } else {
      dp({ type: types.SEARCH_ERROR });
    }
  });
};
