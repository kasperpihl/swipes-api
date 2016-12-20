import { List } from 'immutable';
import { request } from './api';
import { load } from './modal';

const addToCollection = (goalId, content) => (dispatch, getState) => {
  let collection = getState().getIn(['goals', goalId, 'collection']);
  if (!collection) {
    collection = List();
  }
  collection = collection.push(content).toJS();
  dispatch(request('goals.update', {
    goal_id: goalId,
    goal: { collection, id: goalId },
  })).then((res) => {
    console.log('ressy', res);
  });
};
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

const submitStep = (goalId, stepId, message, previousSteps) => dispatch => new Promise((resolve) => {
  let modalOpt;
  if (previousSteps) {
    modalOpt = {
      title: 'Go back to step',
      data: {
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
  const submit = (stepBackId) => {
    dispatch(request('steps.submit', {
      goal_id: goalId,
      step_id: stepId,
      step_back_id: stepBackId,
      message,
    })).then((resMom, err) => {
      resolve();
      if (err) {
          // return console.log('Error completing step', err);
      }
    });
  };
  if (modalOpt) {
    dispatch(load(modalOpt, (res) => {
      if (res) {
        let stepBackId;
        if (previousSteps) {
          const index = res.items.length ? res.items[0] : 0;
          stepBackId = previousSteps.get(index).get('id');
        }
        submit(stepBackId);
      } else {
        resolve();
      }
    }));
  } else {
    submit();
  }
});

export {
  addToCollection,
  submitStep,
  deleteGoal,
};
