import * as types from '../constants/ActionTypes'
import clone from 'clone'
const initialState = { recent: [] };

export default function services (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        var activities = res.activity.slice(0,100);
        activities.reverse().forEach((activity) => {
          swipesUrlProvider.save(activity.checksum, activity.meta);
        })
        activities.reverse();
        return Object.assign({}, state, {recent: activities});
      }
      return state;
    }
    case 'activity_added':{
      var activity = action.payload.data;
      swipesUrlProvider.save(activity.checksum, activity.meta);
      return Object.assign({}, state, {recent: [action.payload.data].concat(state.recent.slice(0, 100)) })
    }
    case types.LOGOUT:{
      return clone(initialState);
    }
    default: 
      return state
  }
}