import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'
const initialState = fromJS({ recent: [] });

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
        return state.set('recent', fromJS(activities));
      }
      return state;
    }
    case 'activity_added':{
      var activity = action.payload.data;
      swipesUrlProvider.save(activity.checksum, activity.meta);
      return state.updateIn(['recent'], (recent) => recent.insert(0), fromJS(activity));
    }
    case types.LOGOUT:{
      return initialState;
    }
    default: 
      return state
  }
}