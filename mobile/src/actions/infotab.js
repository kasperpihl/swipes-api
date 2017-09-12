import * as types from 'constants/ActionTypes';

export function showInfoTab(payload) {
  return { type: types.SHOW_INFOTAB, payload };
}
