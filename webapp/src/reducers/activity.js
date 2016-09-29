import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'
const initialState = fromJS({ recent: [] });

const filterActivity = (activity) => {
  const keys = {}
  return activity.filter((act) => {
    const id = act.get('checksum');
    if(!keys[id]){
      keys[id] = true;
      return true;
    }
    return false;
  })
} 

export default function services (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        var activities = filterActivity(fromJS(res.activity.slice(0,100)));
        activities.forEach((activity) => {
          swipesUrlProvider.save(activity.get('checksum'), activity.get('meta'));
        })
        return state.set('recent', activities);
      }
      return state;
    }
    case 'activity_added':{
      var activity = action.payload.data;
      swipesUrlProvider.save(activity.checksum, activity.meta);
      return filterActivity(state.updateIn(['recent'], (recent) => recent.insert(0, fromJS(activity))));
    }
    case types.LOGOUT:{
      return initialState;
    }
    default: 
      return state
  }
}