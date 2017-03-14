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
      let goals = Map();
      payload.goals.forEach((g) => {
        goals = goals.set(g.id, fromJS(g));
      });
      return goals;
    }
    case 'goals.rename': {
      return state.setIn([payload.goal_id, 'title'], payload.title);
    }
    case 'steps.add': {
      return state.setIn([payload.goal_id, 'step_order'],
        fromJS(payload.step_order),
      ).setIn([payload.goal_id, 'steps', payload.step.id], fromJS(payload.step));
    }
    case 'steps.delete': {
      return state.updateIn([payload.goal_id], (g) => {
        g = g.updateIn(['step_order'], s => s.filter(id => id !== payload.step_id));
        return g.setIn(['steps', payload.step_id, 'deleted'], true);
      });
    }
    case 'steps.rename': {
      return state.setIn([payload.goal_id, 'steps', payload.step_id, 'title'], payload.title);
    }
    case 'steps.assign': {
      return state.setIn([
        payload.goal_id, 'steps', payload.step_id, 'assignees',
      ], fromJS(payload.assignees));
    }
    case 'goal_archived':
    case 'goals.archive': {
      return state.delete(payload.id);
    }
    case 'goals.create':
    case 'goal_created': {
      return state.mergeIn([payload.goal.id], fromJS(payload.goal));
    }
    case 'goal_updated':
    case 'goal_completed':
    case 'goal_notify':
    case 'step_completed':
    case 'goals.notify':
    case 'goals.completeStep':
    case 'goals.update': {
      return state.mergeIn([payload.goal.id], fromJS(payload.goal));
    }
    default:
      return state;
  }
}
