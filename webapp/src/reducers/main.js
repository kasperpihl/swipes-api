import * as types from '../constants/ActionTypes'
import { fromJS, Set } from 'immutable'
const initialState = fromJS({
  socketUrl: null,
  token: null,
  mainClasses: Set(),
  hasLoaded: false,
  activeGoal: null
})

export default function main (state = initialState, action) {
  switch (action.type) {
    case 'rtm.start':{
      if(!action.payload.ok){
        return state;
      }
      return state.withMutations((ns) => ns.set('socketUrl', action.payload.url));
    }

    case types.SET_STATUS:{
      const hasLoaded = (state.get('hasLoaded') || action.status == 'online') ? true : null;
      return state.withMutations((ns) => ns.set('hasLoaded', hasLoaded).set('status', action.status));
    }

    case types.SET_ACTIVE_GOAL: {
      return state.set('activeGoal', action.goalId || null);
    }
    case 'goal_deleted':{
      if(state.get('activeGoal') === action.payload.data.id){
        return state.set('activeGoal', null);
      }
      return state;
    }

    // ======================================================
    // Authorization methods
    // ======================================================
    case 'users.signin':
    case 'users.signup':{
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
