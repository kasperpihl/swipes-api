import { fromJS } from 'immutable';
import * as types from 'constants';
import { KEY_PREFIX } from 'redux-persist/constants';

const initialState = fromJS([]);

const shouldKeepNotification = payload => payload && payload.important && !payload.sender;

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'rtm.start': {
      if (!payload.ok) {
        return state;
      }
      return fromJS(payload.notifications.filter(n => shouldKeepNotification(n)));
    }

    // ======================================================
    // Notifications
    // ======================================================
    case types.NOTIFICATION_ADD: {
      if (!shouldKeepNotification(payload)) {
        return state;
      }
      return state.filter(n => n.get('id') !== payload.id).insert(0, fromJS(payload));
    }
    case 'notifications.markAsSeen.ids':
    case 'notifications_seen_ids': {
      const { notification_ids: ids, last_marked: lastMarked } = payload;
      return state.map((n) => {
        if (ids && ids.indexOf(n.get('id')) !== -1) {
          return n.set('seen_at', lastMarked);
        }
        return n;
      });
    }
    case 'notifications_seen_ts':
    case 'notifications.markAsSeen.ts': {
      const { marked_at, last_marked: lastMarked } = payload;
      return state.map((n) => {
        if (n.get('updated_at') <= lastMarked) {
          return n.set('seen_at', marked_at);
        }
        return n;
      });
    }

    default:
      return state;
  }
}
