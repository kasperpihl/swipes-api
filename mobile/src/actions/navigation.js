import * as types from '../constants/ActionTypes';

export function change(index) {
  return { type: types.NAVIGATION_CHANGE, payload: { index } };
}

export function push(sliderIndex, scene) {
  return { type: types.NAVIGATION_STACK_PUSH, payload: { sliderIndex, scene } };
}
