import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable' 
const initialState = fromJS({});

export default function templates (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        const templates = {}
        res.processes.forEach((template) => {
          templates[template.id] = template;
        })
        return fromJS(templates);
      }
      return state;
    }
    case types.LOGOUT:{
      return initialState;
    }
    default:
      return state
  }
}
