import * as types from '../constants/ActionTypes'

export function toggleFullscreen() {
  return { type: types.TOGGLE_FULLSCREEN }
}

export function toggleSearching() {
  return { type: types.TOGGLE_SEARCHING }
}