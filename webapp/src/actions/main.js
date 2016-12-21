import * as types from 'constants';
import { request } from './api';

export function setStatus(status) {
  return { type: types.SET_STATUS, status };
}

// ======================================================
// Simple persistent cache
// ======================================================
export function cacheSave(index, data) {
  return { type: types.CACHE_SAVE, index, data };
}
export function cacheRemove(index) {
  return { type: types.CACHE_REMOVE, index };
}
export function cacheClear() {
  return { type: types.CACHE_CLEAR };
}

// ======================================================
// Overlays
// ======================================================
export function overlayHide() {
  return { type: types.OVERLAY_HIDE };
}

export function overlayShow(overlay) {
  const payload = { overlay };
  return { type: types.OVERLAY_SHOW, payload };
}

// ======================================================
// Account related
// ======================================================
export function logout() {
  return (dispatch) => {
    localStorage.clear();
    dispatch({ type: types.LOGOUT });
    window.location.replace('/');
  };
}

// ======================================================
// Notes
// ======================================================
export function saveNote(organizationId, noteId, text, unlock) {
  return dispatch => dispatch(request('notes.save', {
    organization_id: organizationId,
    id: noteId,
    text,
    unlock,
  }));
}

export function createNote(organizationId, title) {
  return dispatch => dispatch(request('notes.create', {
    organization_id: organizationId,
    title,
  }));
}

export function toggleSideNote(sideNoteId) {
  return {
    type: types.TOGGLE_SIDE_NOTE,
    payload: {
      sideNoteId,
    },
  };
}
export function closeSideNote() {
  return { type: types.CLOSE_SIDE_NOTE };
}


// ======================================================
// Search
// ======================================================
export function search(query) {
  return (dispatch) => {
    dispatch({ type: types.SEARCH, query });
    dispatch(request('search', { q: query })).then((res) => {
      if (res && res.ok) {
        dispatch({ type: types.SEARCH_RESULTS, result: res.result });
      } else {
        dispatch({ type: types.SEARCH_ERROR });
      }
    });
  };
}
