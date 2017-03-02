import { fromJS } from 'immutable';

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
    default:
      return state;
  }
}
