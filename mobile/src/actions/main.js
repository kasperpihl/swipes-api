import * as ca from 'swipes-core-js/actions';
import * as types from 'constants/ActionTypes';

// ======================================================
// Account related
// ======================================================

export const signout = cb => dp => dp(ca.api.request('users.signout')).then((res) => {
  if (cb) {
    cb(res);
  }
  if (res && res.ok) {
    if (window.persistor) {
      window.persistor.purge();
    }
    dp({ type: types.RESET_STATE });
  }
});

export function modal(payload) {
  return { type: types.SHOW_MODAL, payload };
}

export function loading(payload) {
  return { type: types.SET_LOADING, payload };
}
