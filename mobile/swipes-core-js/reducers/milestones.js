import { fromJS, Map } from 'immutable';

const initialState = fromJS({});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'init': {
      let milestones = Map();
      payload.milestones.forEach((m) => {
        milestones = milestones.set(m.id, fromJS(m));
      });
      return milestones;
    }
    case 'goal_created':
    case 'goals.create':
    case 'goals.archive':
    case 'goal_archived':
    case 'milestones.addGoal':
    case 'milestone_goal_added': {
      if(payload.milestone_id){
        return state.setIn([payload.milestone_id, 'goal_order'], fromJS(payload.goal_order));
      }
      return state;
    }
    case 'milestones.create':
    case 'milestone_created': {
      return state.set(payload.milestone.id, fromJS(payload.milestone));
    }

    default:
      return state;
  }
}
