import * as types from 'constants/ActionTypes';

export function setActionButtons(payload) {
  return { type: types.SET_ACTION_BUTTONS, payload };
}

export function setCollapsed(collapsed) {
  return { type: types.SET_COLLAPSED, payload: { collapsed } };
}

export function sliderChange(sliderIndex) {
  return { type: types.SLIDER_CHANGE, payload: { sliderIndex } };
}

export function push(sliderIndex, scene) {
  return { type: types.NAVIGATION_PUSH, payload: { sliderIndex, scene } };
}

export function pop(sliderIndex, targetIndex) {
  return { type: types.NAVIGATION_POP, payload: { sliderIndex, targetIndex } };
}
