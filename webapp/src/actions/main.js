import * as types from '../constants/ActionTypes'
import { request } from './api'

export function toggleFullscreen() {
  return { type: types.TOGGLE_FULLSCREEN }
}
export function setFullscreenTitle(title, subtitle){
  return { type: types.SET_FULLSCREEN_TITLE, title, subtitle }
}

export function toggleFind() {
  return { type: types.TOGGLE_FIND }
}

export function search(query){
  return { type: types.SEARCH, query };
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


export function signin(data) {
  return request('users.signin', data);
}
export function signup(data){
  return request('users.signup', data);
}

export function logout() {
  localStorage.clear();
  return { type: types.LOGOUT }
}
