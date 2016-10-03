import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'
const initialState = fromJS({});

export default function workflows (state = initialState, action) {
  switch (action.type) {
    case 'rtm.start':{
      const { processes: workflows } = action.payload;
      if(!workflows) return state;

      const tempW = {}
      workflows.forEach((workflow) => {
        tempW[workflow.id] = workflow;
      })
      return fromJS(tempW);
    }
    case types.LOGOUT:{
      return initialState;
    }
    default: 
      return state
  }
}