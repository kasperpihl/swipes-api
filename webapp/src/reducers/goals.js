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
    case 'goals.archive': {
      if (payload.ok) {
        return state.delete(payload.id);
      }
      return state;
    }
    case 'goal_archived': {
      return state.delete(payload.data.id);
    }
    case 'goal_updated':
    case 'goal_completed':
    case 'goal_notify':
    case 'step_got_active':
    case 'step_completed': {
      return state.mergeIn([payload.data.id], fromJS(payload.data));
    }
    case 'goals.notify':
    case 'goals.completeStep':
    case 'goals.update': {
      if (payload.ok) {
        return state.mergeIn([payload.goal.id], fromJS(payload.goal));
      }
      return state;
    }
    case 'goals.create':
    case 'goal_created': {
      if (type === 'goals.create' && !payload.ok) {
        return state;
      }
      return state.set(payload.data.id, fromJS(payload.data));
    }
    case types.GOAL_DELETE: {
      return state;
    }
    default:
      return state;
  }
}
