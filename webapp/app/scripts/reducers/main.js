import * as types from '../constants/ActionTypes'

const initialState = {
  isFullscreen: false,
  isSearching: false,
  socketUrl: null,
  tileBaseUrl: null,
  token: null,
  draggingDot: null,
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
      const mainClasses = toggleUnique(state.mainClasses, 'draggingDot', action.value);
      const closeSearching = action.value ? null : {isSearching: false};
      const draggingDot = action.value ? {
        draggingId: action.draggingId,
        data: action.data,
        pos: null
      } : null

      return Object.assign({}, state, closeSearching, {draggingDot: draggingDot, mainClasses })
    }
    case types.DRAG_DOT:{
      const newDragDot = Object.assign({}, state.draggingDot, {
        pos: {clientX: action.clientX, clientY: action.clientY}, 
        hoverTarget: action.hoverTarget}
      )

      return Object.assign({}, state, {draggingDot: newDragDot})
    }

    // ======================================================
    // Authorization methods
    // ======================================================
    case ('users.signin'):
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