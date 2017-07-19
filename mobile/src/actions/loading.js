import * as types from '../constants/ActionTypes';

export function showLoader(payload) {
  return { type: types.SHOW_LOADER, payload: !!payload };
}
