import { fromJS, Map } from 'immutable';
import { reducerInitToMap } from '../classes/utils';
import * as types from '../constants';

const initialState = fromJS({});

export default function milestonesReducer(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'init': {
      return reducerInitToMap(payload, 'milestones', state);
    }
    case 'milestones.close':
    case 'milestone_closed': {
      if (payload.milestone_id && payload.goal_order) {
        state = state.setIn([payload.milestone_id, 'goal_order'], fromJS(payload.goal_order));
      }
      return state.setIn([payload.milestone_id, 'closed'], true);
    }
    case 'milestones.open':
    case 'milestone_opened': {
      return state.setIn([payload.milestone_id, 'closed'], false);
    }
    case 'milestones.rename':
    case 'milestone_renamed': {
      return state.setIn([payload.milestone_id, 'title'], payload.title);
    }
    case 'goal_created':
    case 'goals.create':
    case 'goals.archive':
    case 'goal_archived':
    case 'milestones.removeGoal':
    case 'milestone_goal_removed':
    case 'milestones.addGoal':
    case 'milestone_goal_added': {
      if (payload.milestone_id && payload.goal_order) {
        return state.setIn([payload.milestone_id, 'goal_order'], fromJS(payload.goal_order));
      }
      return state;
    }
    case 'milestones.create':
    case 'milestone_created': {
      return state.set(payload.milestone.id, fromJS(payload.milestone));
    }
    case types.RESET_STATE: {
      return initialState;
    }
    default:
      return state;
  }
}
