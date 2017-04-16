import { fromJS, Map } from 'immutable';

const initialState = fromJS({});

export default function usersReducer(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'init': {
      let users = Map();
      payload.users.forEach((u) => {
        users = users.set(u.id, fromJS(u));
      });
      return users;
    }
    case 'me.uploadProfilePhoto':
    case 'me.updateProfile':
    case 'profile_updated': {
      return state.mergeIn([payload.user_id, 'profile'], fromJS(payload.profile));
    }
    case 'user_invited':
    case 'users.invite':{
      return state.set(payload.user.id, fromJS(payload.user));
    }
    default:
      return state;
  }
}
