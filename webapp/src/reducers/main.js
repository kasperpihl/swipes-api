import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'
const initialState = fromJS({
  isFullscreen: false,
  isSearching: false,
  socketUrl: null,
  tileBaseUrl: null,
  overlay: null,
  token: null,
  draggingDot: null,
  mainClasses: [],
  hasLoaded: false
})
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
      return state.withMutations((ns) => ns.set('socketUrl', action.payload.url).set('tileBaseUrl', action.payload.workflow_base_url));
    }
    case types.SET_OVERLAY: {
      return state.set('overlay', action.overlay);
    }
    case types.SEARCH:{
      return state.set('searchQuery', action.query);
    }
    case types.SET_STATUS:{
      const hasLoaded = (action.status == 'online') ? true : null;
      return state.withMutations((ns) => ns.set('hasLoaded', hasLoaded).set('status', action.status));
    }

    case types.TOGGLE_FULLSCREEN:{
      return state.set('isFullscreen', !state.get('isFullscreen'));
    }
    case types.SET_FULLSCREEN_TITLE:{
      return state.withMutations((ns) => ns.set('fullscreenTitle', action.title).set('fullscreenSubtitle', action.subtitle));
    }

    case types.TOGGLE_FIND:{
      return state.set('isFinding', !state.get('isFinding'));
    }

    case types.SET_DRAGGING_DOT:{
      const draggingDot = action.value ? {
        draggingId: action.draggingId,
        data: action.data
      } : null
      let mainClasses = state.get('mainClasses');
      if(!mainClasses){
        mainClasses = new Set();
      }
      const addOrDelete = action.value ? 'add' : 'delete';
      mainClasses = mainClasses[addOrDelete]('draggingDot');

      return state.withMutations((ns) => ns.set('isFinding', !action.value).set('draggingDot', draggingDot).set('mainClasses', mainClasses))
    }
    case types.DRAG_DOT:{
      return state.setIn(['draggingDot', 'hoverTarget'], action.hoverTarget);
    }

    // ======================================================
    // Authorization methods
    // ======================================================
    case ('users.signin'):
    case ('users.signup'):{
      if(!action.payload || !action.payload.ok){
        return state;
      }
      return state.set('token', action.payload.token);
    }
    case types.LOGOUT:{
      return initialState;
    }


    default:
      return state
  }
}
