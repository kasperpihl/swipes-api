import { request } from './api';
import { load } from './modal';

/* global currentGoal*/

const deleteGoal = goalId => (dispatch) => {
  dispatch(load(
    {
      title: 'Delete Goal?',
      data: {
        message: 'Are you sure you want to delete this goal?',
        buttons: ['Yes', 'No'],
      },
      type: 'warning',
    },
    (res) => {
      if (res && res.button === 0) {
        dispatch(request('goals.delete', { goal_id: goalId }));
      }
    },
  ));
};

const submitStep = (goalId, stepId, data, previousSteps) => dispatch => new Promise((resolve) => {
  let modalOpt = {
    title: 'Personal hand-off',
    data: {
      textarea: {
        placeholder: 'Personal message (optional)',
      },
      buttons: ['Submit'],
    },
  };
  if (previousSteps) {
    modalOpt = {
      title: 'Choose reason',
      data: {
        textarea: {
          placeholder: 'Personal hand-off, what should be changed? (required)',
        },
        list: {
          selectable: true,
          items: previousSteps.map((step, i) => {
            const title = `${i + 1}. ${step.get('title')}`;
            const selected = (i === 0);
            return { title, selected, id: step.get('id') };
          }).toJS(),
        },
        buttons: ['Submit'],
      },
    };
  }
  dispatch(load(modalOpt, (res) => {
    let message = null;
    let stepBackId = null;
    if (res) {
      message = res.text;
      if (previousSteps) {
        const index = res.items.length ? res.items[0] : 0;
        stepBackId = previousSteps.get(index).get('id');
      }

      dispatch(request('steps.submit', {
        goal_id: goalId,
        step_id: stepId,
        step_back_id: stepBackId,
        data,
        message,
      })).then((resMom, err) => {
        resolve();
        if (err) {
            // return console.log('Error completing step', err);
        }
      });
    } else {
      resolve();
    }
  }));
});

export {
  submitStep,
  deleteGoal,
};
