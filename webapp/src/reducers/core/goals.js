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
    case 'steps.add': {
      if (payload.ok) {
        state = state.setIn([payload.goal_id, 'step_order'],
          fromJS(payload.step_order),
        ).setIn([payload.goal_id, 'steps', payload.step.id], fromJS(payload.step));
      }
      return state;
    }
    case 'steps.delete': {
      if (payload.ok) {
        state = state.updateIn([payload.goal_id], (g) => {
          g = g.updateIn(['step_order'], s => s.filter(id => id !== payload.step_id));
          return g.setIn(['steps', payload.step_id, 'deleted'], true);
        });
      }
      return state;
    }
    case 'steps.rename': {
      if (payload.ok) {
        return state.setIn([payload.goal_id, 'steps', payload.step_id, 'title'], payload.title);
      }
      return state;
    }
    case 'steps.assign': {
      if (payload.ok) {
        return state.setIn([
          payload.goal_id, 'steps', payload.step_id, 'assignees',
        ], fromJS(payload.assignees));
      }
      return state;
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
