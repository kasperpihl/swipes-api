import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({});

export default function goalsReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case 'rtm.start': {
      const { goals } = payload;
      if (!goals) return state;

      const tempG = {};
      goals.forEach((goal) => {
        tempG[goal.id] = goal;
      });
      return fromJS(tempG);
    }
    case 'goal_deleted': {
      return state.delete(payload.id);
    }
    case 'goal_updated':
    case 'goal_created': {
      return state.set(payload.data.id, fromJS(payload.data));
    }
    case 'step_changed': {
      const stepId = payload.id;
      const goalId = payload.id.split('-')[0];
      return state.updateIn([goalId, 'steps'], steps => steps.map((step) => {
        if (step.get('id') === stepId) {
          return fromJS(payload);
        }
        return step;
      }));
    }
    case types.GOAL_DELETE: {
      return state;
    }
    case types.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
