import * as types from '../constants/ActionTypes'
import { request } from './api'
import { load } from './modal'

const deleteGoal = (goalId) => {
  return (dispatch, getState) => {
    dispatch(load({title: 'Delete Goal?', data: {message: 'Are you sure you want to delete this goal?', buttons: ['Yes', 'No']}, type: 'warning'}, (res) => {
      if(res && !res.button){

        request('goals.delete', {goal_id: currentGoal.get('id')}).then((res) =>{
          if(!res || !res.ok){

          }
        });
      }
    }))
  }
}

const submitStep = (goalId, stepId, data, previousSteps) => {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
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
              items: previousSteps.map((step, i) => {
                const selected = (i === 0);
                const title = (i + 1) + '. ' + step.get('title');
                return { title, id: step.get('id')}
              }).toJS()
            },
            buttons: ['Submit']
          }
        }
      }
      dispatch(load( modalOpt, (res) => {
        let message = null;
        let step_back_id = null;
        if(res){
          message = res.text;
          if(previousSteps){
            const index = res.items.length ? res.items[0] : 0;
            step_back_id = previousSteps.get(index).get('id');
          }

          dispatch(request('steps.submit', {
            goal_id: goalId,
            step_id: stepId,
            step_back_id,
            data,
            message
          })).then((res, err) => {
            resolve();
            if (err) {
              return console.log('Error completing step', err);
            }
          })

        }
        else{
          resolve();
        }

      }))
    })

  }
}

export {
  submitStep,
  deleteGoal
}
