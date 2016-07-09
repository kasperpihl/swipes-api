import * as types from '../constants/ActionTypes'
import { request } from './apiActions'

import { browserHistory } from 'react-router'
console.log(request);

export function login(data) {
  return request('users.login', data);
}
export function signup(data){
  return request('users.signup', data);
}

export function logout() {
  return { type: types.LOGOUT }
}