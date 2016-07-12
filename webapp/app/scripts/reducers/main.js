import * as types from '../constants/ActionTypes'

const initialState = {
  isFullscreen: false,
  isSearching: false,
  socketUrl: null,
  tileBaseUrl: null,
  token: null,
  draggingDot: false,
  draggingDotPos: null,
  mainClasses: [],
  hasLoaded: false
}
function toggleUnique(array, string, toggle){
  array = array || [];
  if(toggle){
    return [ ...new Set(array.concat([string])) ]
  }
  return array.filter( value => (string !== value))
}


export default function main (state = initialState, action) {
  switch (action.type) {
    case 'rtm.start':{
      if(!action.payload.ok){
        return state;
      }
      return Object.assign({}, state, {
        socketUrl: action.payload.url, 
        tileBaseUrl: action.payload.workflow_base_url,
      })
    }

    case types.SET_STATUS:{
      const hasLoaded = (action.status == 'online') ? {hasLoaded: true} : null
      return Object.assign({}, state, {status: action.status}, hasLoaded)
    }

    case types.TOGGLE_FULLSCREEN:{
      return Object.assign({}, state, {isFullscreen: !state.isFullscreen})
    }

    case types.TOGGLE_SEARCHING:{
      return Object.assign({}, state, {isSearching: !state.isSearching})
    }

    case types.SET_DRAGGING_DOT:{
      let mainClasses = toggleUnique(state.mainClasses, 'draggingDot', action.value);
      return Object.assign({}, state, {draggingDot: action.value, mainClasses, 'draggingDotPos': null })
    }
    case types.DRAG_DOT:{
      return Object.assign({}, state, {draggingDotPos: {clientX: action.clientX, clientY: action.clientY}})
    }

    // ======================================================
    // Authorization methods
    // ======================================================
    case ('users.login'):
    case ('users.signup'):{
      if(action.payload && action.payload.ok){
        return Object.assign({}, {token: action.payload.token});
      }
      console.log('result', action, state);
      // K_TODO: Handle error
      return state;
    }
    case types.LOGOUT:{
      return Object.assign({}, initialState)
    }


    default: 
      return state
  }
}