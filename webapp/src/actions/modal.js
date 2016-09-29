import * as types from '../constants/ActionTypes'
import { request } from './api'

export function load(data, callback) {
  return { type: types.LOAD_MODAL, data, callback }
}
export function hide() {
  return { type: types.HIDE_MODAL }
}