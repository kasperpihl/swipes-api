import * as types from '../constants/ActionTypes'

const initialState = {
  isFullscreen: false,
  isSearching: false
}

export default function main (state = initialState, action) {
	switch (action.type) {
		case types.TOGGLE_FULLSCREEN:
			return Object.assign({}, state, {isFullscreen: !state.isFullscreen})
		case types.TOGGLE_SEARCHING:
			return Object.assign({}, state, {isSearching: !state.isSearching})
		default: 
			return state
	}
}