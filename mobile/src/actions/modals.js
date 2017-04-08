import * as types from '../constants/ActionTypes';

export function showModal(payload) {
  return { type: types.SHOW_MODAL, payload };
}
