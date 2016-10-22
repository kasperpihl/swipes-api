import * as types from '../constants/ActionTypes'
import { request } from './api'

const completeStep = (goalId, stepId) => {
  return (dispatch, getState) => {
    console.log(goalId)
    console.log(stepId)
    dispatch({ type: types.GOAL_COMPLETE_STEP, goalId });
    const opt = {
      goal_id: goalId,
      step_id: stepId,
      payload: {
        completed: true
      }}
    console.log(opt);

    dispatch(request('steps.update', {
      goal_id: goalId,
      step_id: stepId,
      payload: {
        completed: true
      }
    })).then((res, err) => {
      if (err) {
        return console.log('Error completing step', err);
      }
    })
  }
}

export {
  completeStep
}
