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
export function saveNote(goalId, text) {
  return (dispatch) => {
    dispatch(request('save.note', { goalId, text })).then((res) => {

    });
  };
}


// ======================================================
// Search
// ======================================================
export function search(query) {
  return (dispatch) => {
    dispatch({ type: types.SEARCH, query });
    dispatch(request('search', { q: query })).then((res) => {
      if (res && res.ok) {
        console.log(res);
        dispatch({ type: types.SEARCH_RESULTS, result: res.result });
      } else {
        dispatch({ type: types.SEARCH_ERROR });
      }
    });
  };
}
