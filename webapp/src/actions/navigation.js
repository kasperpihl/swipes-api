import * as types from '../constants/ActionTypes';

const validateObj = (obj) =>{
  return null;
}

const fireOnCloseToIndex = (history, data) => {
  history.findLastEntry((o, i) => {
    if (typeof o.get('onClose') === 'function') {
      o.get('onClose')(data);
    }
    if (typeof index !== 'undefined') {
      return (i === (index + 1));
    }
    return false;
  });
};
const popHandler = (getState, index) => {

}

export function set(id, obj){

}
export function push(obj){

}
export function pop(data){
  return (dispatch, getState) => {
    fireOnCloseForOverlays(getState);
    dispatch({ type: types.POP_OVERLAY });
  };
}
export function popTo(i){
  return (dispatch, getState) => {
    fireOnCloseForOverlays(getState);
    dispatch({ type: types.POP_OVERLAY });
  };
}
export function popToRoot(){

}


export function clear(index) {
  return (dispatch, getState) => {
    const overlays = getState().get('overlays');
    fireOnCloseForOverlays(overlays, index);
    dispatch({ type: types.CLEAR_OVERLAY, index });
  };
}

export function set(overlay) {
  return (dispatch, getState) => {
    overlay = validateOverlay(overlay);
    const overlays = getState().get('overlays');
    fireOnCloseForOverlays(overlays);
    dispatch({ type: types.SET_OVERLAY, overlay });
  };
}

export function pop() {
  return (dispatch, getState) => {
    const overlays = getState().get('overlays');
    fireOnCloseForOverlays(overlays, overlays.size - 2);
    dispatch({ type: types.POP_OVERLAY });
  };
}
export function push(overlay) {
  return { type: types.PUSH_OVERLAY, overlay };
}
