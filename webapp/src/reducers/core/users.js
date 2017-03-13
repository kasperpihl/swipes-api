import { fromJS, Map } from 'immutable';

const initialState = fromJS({});

export default function usersReducer(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'rtm.start': {
      if (!payload.ok) {
        return state;
      }
      let users = Map();
      payload.users.forEach((u) => {
        users = users.set(u.id, fromJS(u));
      });
      return users;
    }
    default:
      return state;
  }
}
