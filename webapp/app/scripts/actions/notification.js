import * as types from '../constants/ActionTypes'

export function send(data) {
  return { type: types.SEND_NOTIFICATION, payload: data }
}