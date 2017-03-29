import * as types from '../constants/ActionTypes';

export function change(index) {
  return { type: types.NAVIGATION_CHANGE, payload: {index} };
}