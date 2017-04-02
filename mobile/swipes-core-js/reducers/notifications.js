import { fromJS } from 'immutable';
import * as types from '../constants';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = fromJS([]);

const sortFn = (b, c) => c.get('updated_at').localeCompare(b.get('updated_at'));

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case REHYDRATE:
      if (action && action.payload && action.payload.notifications) {
        return action.payload.notifications.toList();
      }
      return state;
    case 'rtm.start': {
      return fromJS(payload.notifications).sort(sortFn);
    }

    // ======================================================
    // Notifications
    // ======================================================
    case types.NOTIFICATION_ADD: {
      return state.filter(n => n.get('id') !== payload.id).insert(0, fromJS(payload));
    }
    case 'notifications.markAsSeen':
    case 'notifications_seen': {
      const { notification_ids: ids, last_marked: lastMarked } = payload;
      return state.map((n) => {
        if (ids && ids.indexOf(n.get('id')) !== -1) {
          return n.set('seen_at', lastMarked);
        }
        return n;
      });
    }

    default:
      return state;
  }
}
