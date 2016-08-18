import * as types from '../constants/ActionTypes'
import clone from 'clone'
const initialState = { recent: [] };

export default function services (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        return Object.assign({}, state, {recent: res.activity.slice(0)});
      }
      return state;
    }
    case 'activity_added':{
      return Object.assign({}, state, {recent: state.recent.concat(action.payload.data) })
    }
    case types.LOGOUT:{
      return clone(initialState);
    }
    default: 
      return state
  }
}