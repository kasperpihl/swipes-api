import * as types from '../constants/ActionTypes'
import { request } from './api'

export function login(data) {
  return request('users.login', data);
}
export function signup(data){
  return request('users.signup', data);
}

export function logout() {
  return { type: types.LOGOUT }
}