import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS([]);

const sortFn = (b, c) => c.get('updated_at').localeCompare(b.get('updated_at'));

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'rtm.start': {
      return fromJS(payload.notifications).sort(sortFn);
    }

    // ======================================================
    // Notifications
    // ======================================================
    case types.NOTIFICATION_ADD: {
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

    default:
      return state;
  }
}
