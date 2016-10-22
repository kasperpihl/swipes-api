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
    case 'goal_deleted':{
      return state.delete(action.payload.data.id);
    }
    case 'goal_created':{
      return state.set(action.payload.data.id, fromJS(action.payload.data));
    }
    case 'step_changed': {
      console.log('step change', action);
      const stepId = action.payload.data.id;
      const goalId = action.payload.data.id.split('-')[0];
      return state.updateIn([goalId, 'steps'], (steps) => {
        return steps.map((step) => {
          if(step.get('id') === stepId){
            return fromJS(action.payload.data);
          }
          return step;
        })
      })
    }
    case types.GOAL_COMPLETE_STEP:{
      let completedOne = false;
      return state.updateIn([action.goalId, 'steps'], (steps) => steps.map((s) => {
        if(!s.get('completed') && !completedOne){
          completedOne = true;
          return s.set('completed', true);
        }
        return s;
      }))
    }
    case types.LOGOUT:{
      return initialState;
    }
    default:
      return state
  }
}
