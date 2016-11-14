import * as types from '../constants/ActionTypes'
import { request } from './api'
import { load } from './modal'

const submitStep = (goalId, stepId, data) => {
  return (dispatch, getState) => {
    const modalOpt = {
      title: 'Personal hand-off',
      data: {
        textarea: {
          placeholder: 'Personal message (optional)'
        },
        buttons: ['Submit']
      }
    }
    dispatch(load( modalOpt, (res) => {
      let message = null;
      if(res && res.text){
        message = res.text;
      }
      console.log(data);
      dispatch(request('steps.submit', {
        goal_id: goalId,
        step_id: stepId,
        data,
        message
      })).then((res, err) => {
        if (err) {
          return console.log('Error completing step', err);
        }
      })
    }))
  }
}

export {
  submitStep
}

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
