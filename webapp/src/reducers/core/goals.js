import { fromJS, Map } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({});

export default function goalsReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case 'rtm.start': {
      if (!payload.ok) {
        return state;
      }
      let goals = Map();
      payload.goals.forEach((g) => {
        goals = goals.set(g.id, fromJS(g));
      });
      return goals;
    }

    case 'goal_archived':
    case 'goals.archive': {
      if (payload.ok || typeof payload.ok === 'undefined') {
        return state.delete(payload.id);
      }
      return state;
    }
    case 'goal_updated':
    case 'goal_created':
    case 'goal_completed':
    case 'goal_notify':
    case 'step_completed':
    case 'goals.notify':
    case 'goals.completeStep':
    case 'goals.create':
    case 'goals.update': {
      if (payload.ok || typeof payload.ok === 'undefined') {
        return state.mergeIn([payload.goal.id], fromJS(payload.goal));
      }
      return state;
    }
    default:
      return state;
  }
}
