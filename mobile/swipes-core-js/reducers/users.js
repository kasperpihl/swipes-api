import { fromJS, Map } from 'immutable';
import { reducerInitToMap } from '../classes/utils';
import * as types from '../constants';

const initialState = fromJS({});

export default function usersReducer(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'init': {
      return reducerInitToMap(payload, 'users', state);
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
    case types.RESET_STATE: {
      return initialState;
    }  
    default:
      return state;
  }
}
