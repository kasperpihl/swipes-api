import * as types from '../constants/ActionTypes'
export function completeStep(goalId) {
  return { type: types.GOAL_COMPLETE_STEP, goalId }
}
