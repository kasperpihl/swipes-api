import * as types from 'constants';
import { fromJS } from 'immutable';

const initialState = fromJS([]);

export default function notificationsReducer(state = initialState, action) {
  const { payload } = action;
  switch (action.type) {
    case 'rtm.start': {
      const { notifications } = payload;
      if (!notifications) return state;
      return fromJS(notifications);
    }
    case types.NOTIFICATION_ADD: {
      return state.insert(0, fromJS({ id: payload.id, data: payload }));
    }
    case types.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
