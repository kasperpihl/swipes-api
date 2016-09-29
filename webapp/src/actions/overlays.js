import * as types from '../constants/ActionTypes'

const validateOverlay = (overlay) => {
  if(typeof overlay === 'string'){
    overlay = {
      component: overlay,
      title: overlay
    }
  }
  return overlay;
}

export function clear(index){
  return { type: types.CLEAR_OVERLAY, index };
}

export function set(overlay){
  overlay = validateOverlay(overlay);
  return { type: types.SET_OVERLAY, overlay };
}
export function push(overlay){
  return { type: types.PUSH_OVERLAY, overlay };
}