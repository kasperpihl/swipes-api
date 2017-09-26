import * as ca from 'swipes-core-js/actions';
import * as types from 'constants/ActionTypes';
import LoadingModal from 'modals/LoadingModal';
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


export function modal(payload) {
  return { type: types.SHOW_MODAL, payload };
}

export function loading(isLoading, props) {
  if(!isLoading) {
    return modal();
  }
  return modal({ 
    component: LoadingModal,
    props: props || null,
    modalProps: {
      isDisabled: true,
    }
  });
}
