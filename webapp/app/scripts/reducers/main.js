import * as types from '../constants/ActionTypes'

const initialState = {
  isFullscreen: false,
  isSearching: false,
  socketUrl: null,
  tileBaseUrl: null,
  hasLoaded: false
}

export default function main (state = initialState, action) {
  switch (action.type) {
    case 'rtm.start':
      if(!action.payload.ok){
        return state;
      }
      return Object.assign({}, state, {
        socketUrl: action.payload.url, 
        tileBaseUrl: action.payload.workflow_base_url,
        hasLoaded: true
      })
    case types.SET_STATUS:{
      return Object.assign({}, state, {status: action.status})
    }
    case types.TOGGLE_FULLSCREEN:
      return Object.assign({}, state, {isFullscreen: !state.isFullscreen})
    case types.TOGGLE_SEARCHING:
      return Object.assign({}, state, {isSearching: !state.isSearching})
    default: 
      return state
  }
}