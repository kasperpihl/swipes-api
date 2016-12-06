import * as types from '../constants/ActionTypes';

const validateObj = obj => null;

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

};

export function init() {
  return (dispatch, getState) => {
    const state = getState();
    const navId = state.getIn(['navigation', 'currentId']);
  };
}

export function set(id, obj) {

}
export function push(obj) {

}
export function pop(data) {
  return (dispatch, getState) => {
    fireOnCloseForOverlays(getState);
    dispatch({ type: types.POP_OVERLAY });
  };
}
export function popTo(i) {
  return (dispatch, getState) => {
    fireOnCloseForOverlays(getState);
    dispatch({ type: types.POP_OVERLAY });
  };
}
export function popToRoot() {

}
