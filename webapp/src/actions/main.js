import * as types from '../constants/ActionTypes'

export function toggleFullscreen() {
  return { type: types.TOGGLE_FULLSCREEN }
}

export function setStatus(status) {
  return { type: types.SET_STATUS, status: status }
}

export function sendNotification(data) {
  return { type: types.SEND_NOTIFICATION, payload: data }
}

export function startDraggingDot(draggingId, data){
  return { type: types.SET_DRAGGING_DOT, value: true, draggingId, data };
}
export function stopDraggingDot(){
  return { type: types.SET_DRAGGING_DOT, value: false }
}
export function dragDot(hoverTarget){
  return { type: types.DRAG_DOT, hoverTarget }
}


export function setActiveGoal(goalId){
  return { type: types.SET_ACTIVE_GOAL, goalId };
}


export function logout() {
  return (dispatch, getState) => {
    localStorage.clear();
    dispatch({ type: types.LOGOUT })
    window.location.replace('/');
  }
}
