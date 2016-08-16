import * as types from '../constants/ActionTypes'
import clone from 'clone'
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
      const newState = clone(state);
      newState.socketUrl=  action.payload.url; 
      newState.tileBaseUrl = action.payload.workflow_base_url;
      return newState;
    }

    case types.SET_STATUS:{
      const hasLoaded = (action.status == 'online') ? {hasLoaded: true} : null
      return Object.assign({}, state, {status: action.status}, hasLoaded)
    }

    case types.TOGGLE_FULLSCREEN:{
      const newState = clone(state);
      newState.isFullscreen = !state.isFullscreen;
      return newState;
    }

    case types.TOGGLE_SEARCHING:{
      const newState = clone(state);
      newState.isSearching = !state.isSearching;
      return newState;
    }

    case types.SET_DRAGGING_DOT:{
      const mainClasses = toggleUnique(state.mainClasses, 'draggingDot', action.value);
      const closeSearching = action.value ? null : {isSearching: false};
      const draggingDot = action.value ? {
        draggingId: action.draggingId,
        data: action.data,
        pos: null
      } : null
      const newState = clone(state);
      newState.closeSearching = closeSearching;
      newState.draggingDot = { draggingDot, mainClasses };
      return newState;
    }
    case types.DRAG_DOT:{
      const newState = clone(state);
      newState.draggingDot = Object.assign(newState.draggingDot, {
        pos: {clientX: action.clientX, clientY: action.clientY},
        hoverTarget: action.hoverTarget
      })

      return newState
    }

    // ======================================================
    // Authorization methods
    // ======================================================
    case ('users.signin'):
    case ('users.signup'):{
      if(!action.payload || !action.payload.ok){
        return state;
      }
      const newState = clone(state);
      newState.token = action.payload.token;
      return newState;
    }
    case types.LOGOUT:{
      return clone(initialState);
    }


    default: 
      return state
  }
}