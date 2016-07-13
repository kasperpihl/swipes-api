import * as types from '../constants/ActionTypes'
import { request } from './api'

export function toggleFullscreen() {
  return { type: types.TOGGLE_FULLSCREEN }
}

export function toggleSearching() {
  return { type: types.TOGGLE_SEARCHING }
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
export function dragDot(clientX, clientY, hoverTarget){
  return { type: types.DRAG_DOT, clientX, clientY, hoverTarget }
}


export function login(data) {
  return request('users.login', data);
}
export function signup(data){
  return request('users.signup', data);
}

export function logout() {
  return { type: types.LOGOUT }
}