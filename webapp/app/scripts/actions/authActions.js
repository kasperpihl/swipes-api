import * as types from '../constants/ActionTypes'
import { browserHistory } from 'react-router'

export function login(token) {
  return { type: types.LOGIN, token }
}

export function logout() {
  return { type: types.LOGOUT }
}