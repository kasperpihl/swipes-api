import { fromJS, Map } from 'immutable';

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
    case 'goal_renamed':
    case 'goals.rename': {
      if (state.getIn([payload.goal_id, 'title']) === payload.title) {
        return state;
      }
      return state.setIn([payload.goal_id, 'title'], payload.title);
    }
    case 'goals.completeStep':
    case 'step_completed':
    case 'goal_completed':
    case 'goal_notify':
    case 'goals.notify':
    case 'goal_started':
    case 'goals.start': {
      return state.mergeIn([payload.goal.id], payload.goal);
    }
    case 'step_added':
    case 'steps.add': {
      if (state.getIn([payload.goal_id, 'steps', payload.step.id])) {
        return state;
      }
      state = state.setIn([payload.goal_id, 'step_order'], fromJS(payload.step_order));
      return state.setIn([payload.goal_id, 'steps', payload.step.id], fromJS(payload.step));
    }
    case 'step_deleted':
    case 'steps.delete': {
      if (!state.getIn([payload.goal_id, 'steps', payload.step_id])) {
        return state;
      }
      return state.updateIn([payload.goal_id], (g) => {
        g = g.updateIn(['step_order'], s => s.filter(id => id !== payload.step_id));
        return g.setIn(['steps', payload.step_id, 'deleted'], true);
      });
    }
    case 'step_renamed':
    case 'steps.rename': {
      if (state.getIn([payload.goal_id, 'steps', payload.step_id, 'title']) === payload.title) {
        return state;
      }
      return state.setIn([payload.goal_id, 'steps', payload.step_id, 'title'], payload.title);
    }
    case 'step_assigned':
    case 'steps.assign': {
      return state.setIn([
        payload.goal_id, 'steps', payload.step_id, 'assignees',
      ], fromJS(payload.assignees));
    }
    case 'goal_archived':
    case 'goals.archive': {
      if (!state.get(payload.id)) {
        return state;
      }
      return state.delete(payload.id);
    }
    case 'goals.create':
    case 'goal_created': {
      if (state.get(payload.id)) {
        return state;
      }
      return state.mergeIn([payload.goal.id], fromJS(payload.goal));
    }
    case 'attachments.add':
    case 'attachment_added': {
      return state.updateIn([payload.target_id], (g) => {
        const aId = payload.attachment.id;
        if (!g || g.getIn(['attachments', aId])) return g;
        g = g.set('attachment_order', fromJS(payload.attachment_order));
        return g.setIn(['attachments', aId], fromJS(payload.attachment));
      });
    }
    case 'attachments.rename':
    case 'attachment_renamed': {
      return state.updateIn([payload.target_id], (g) => {
        const aId = payload.attachment_id;
        if (!g || g.getIn(['attachments', aId, 'title']) === payload.title) return g;
        return g.setIn(['attachments', aId, 'title'], payload.title);
      });
    }
    case 'attachment_deleted':
    case 'attachments.delete': {
      return state.updateIn([payload.target_id], (g) => {
        const aId = payload.attachment_id;
        if (!g || g.getIn(['attachments', aId, 'deleted'])) return g;
        g = g.updateIn(['attachment_order'], ao => ao.filter(id => id !== aId));
        return g.setIn(['attachments', aId, 'deleted'], true);
      });
    }

    default:
      return state;
  }
}
