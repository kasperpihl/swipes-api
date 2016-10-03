import * as types from '../constants/ActionTypes'
import { request } from './api'

export function load(props, callback) {
  return { type: types.LOAD_MODAL, props, callback }
}
export function hide() {
  return { type: types.HIDE_MODAL }
}