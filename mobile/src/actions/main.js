import * as ca from '../../swipes-core-js/actions';
import * as types from '../constants/ActionTypes';

// ======================================================
// Account related
// ======================================================

export const signout = cb => dp => dp(ca.api.request('users.signout')).then((res) => {
  if (cb) {
    cb(res);
  }
  if (res && res.ok) {
    window.persistor.purge();
    dp({ type: types.RESET_STATE });
  }
});