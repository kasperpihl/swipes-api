import * as types from '../constants/ActionTypes'
import { request } from './apiActions'

import { browserHistory } from 'react-router'
console.log(request);

export function login(data) {
  return request('users.login', data, types.REQ_LOGIN);
  //return { type: types.LOGIN, token }
}
export function signup(data){
  return request('users.signup', data, types.REQ_LOGIN);
}

export function logout() {
  return { type: types.LOGOUT }
}