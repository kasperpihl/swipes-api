import * as types from 'constants';

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
