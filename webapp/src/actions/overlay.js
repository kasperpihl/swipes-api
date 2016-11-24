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
const fireOnCloseForOverlays = (overlays, index) => {
  overlays.findLastEntry((o, i) => {
    if(typeof o.get('onClose') === 'function'){
      o.get('onClose')();
    }
    if(typeof index !== 'undefined'){
      return (i === (index + 1));
    }
    return false;
  })
}
export function clear(index){
  return (dispatch, getState) => {
    const overlays = getState().get('overlays');
    fireOnCloseForOverlays(overlays, index);
    dispatch({ type: types.CLEAR_OVERLAY, index })
  }
}

export function set(overlay){
  return (dispatch, getState) => {
    overlay = validateOverlay(overlay);
    const overlays = getState().get('overlays');
    fireOnCloseForOverlays(overlays);
    dispatch({ type: types.SET_OVERLAY, overlay })
  }

}
export function push(overlay){
  return { type: types.PUSH_OVERLAY, overlay };
}
