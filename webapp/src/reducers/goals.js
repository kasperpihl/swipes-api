import * as types from '../constants/ActionTypes'
import { fromJS, Map } from 'immutable'
const initialState = fromJS({});

export default function goals (state = initialState, action) {
  switch (action.type) {
    case 'rtm.start':{
      const { goals } = action.payload;
      if(!goals) return state;

      const tempG = {}
      goals.forEach((goal) => {
        tempG[goal.id] = goal;
      })
      return fromJS(tempG);
    }
    case types.LOGOUT:{
      return initialState;
    }
    default: 
      return state
  }
}