import * as types from 'constants/ActionTypes';

export function show(payload) {
  return { type: types.SHOW_MODAL, payload };
}
