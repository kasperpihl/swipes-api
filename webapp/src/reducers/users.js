import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({});

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'): {
      const res = action.payload;
      if (res.ok) {
        const users = {};
        res.users.forEach((user) => {
          users[user.id] = user;
        });
        return fromJS(users);
      }
      return state;
    }
    case types.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
