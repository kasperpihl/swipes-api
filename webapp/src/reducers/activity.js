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
  const {
    type,
    payload
  } = action

  switch (type) {
    case ('rtm.start'):{
      if(payload.ok){
        const activities = filterActivity(fromJS(payload.activity.slice(0,100)));
        activities.forEach((activity) => {
          swipesUrlProvider.save(activity.get('checksum'), activity.get('meta'));
        })
        return state.set('recent', activities);
      }
      return state;
    }
    case 'activity_added':{
      swipesUrlProvider.save(payload.checksum, payload.meta);
      return filterActivity(state.updateIn(['recent'], (recent) => recent.insert(0, fromJS(payload))));
    }
    case types.LOGOUT:{
      return initialState;
    }
    default:
      return state
  }
}
