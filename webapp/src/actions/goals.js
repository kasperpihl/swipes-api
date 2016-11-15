import * as types from '../constants/ActionTypes'
import { request } from './api'
import { load } from './modal'

const submitStep = (goalId, stepId, data, previousSteps) => {
  return (dispatch, getState) => {
    let modalOpt = {
      title: 'Personal hand-off',
      data: {
        textarea: {
          placeholder: 'Personal message (optional)'
        },
        buttons: ['Submit']
      }
    }
    if(previousSteps){
      modalOpt = {
        title: 'Choose reason',
        data: {
          textarea: {
            placeholder: 'Personal hand-off, what should be changed? (required)'
          },
          list: {
            selectable: true,
            items: previousSteps.map((step) => {
              return { title: step.get('title'), id: step.get('id')}
            }).toJS()
          },
          buttons: ['Submit']
        }
      }
      modalOpt.data.list.items = [{title: '1. Gather Feedback', id: '123'}, {title: '2. Design Iteration', id: '234'}, {title: '3. Moodboard', id: '345'}];
    }
    dispatch(load( modalOpt, (res) => {
      let message = null;
      if(res){
        message = res.text;
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

      }

    }))
  }
}

export {
  submitStep
}
