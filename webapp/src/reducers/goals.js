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
      return state.delete(payload.data.id);
    }
    case 'goal_updated':
    case 'step_got_active':
    case 'step_completed': {
      return state.mergeIn([payload.data.id], fromJS(payload.data));
    }
    case 'goals.completeStep':
    case 'goals.update': {
      return state.mergeIn([payload.goal.id], fromJS(payload.goal));
    }
    case 'goals.create':
    case 'goal_created': {
      return state.set(payload.data.id, fromJS(payload.data));
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
