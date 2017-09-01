import { fromJS, Map } from 'immutable';
import { reducerInitToMap } from '../classes/utils';
import * as types from '../constants';

const initialState = fromJS({});

const updateStateFromOrg = (state, org) => {
  let tempState = state;
  const disabledUsers = org.disabled_users;
  if(disabledUsers) {
    state.forEach((u) => {
      const isDisabled = !!(disabledUsers.indexOf(u.get('id')) > -1)
      if(!!u.get('disabled') !== isDisabled) {
        tempState = state.setIn([u.get('id'), 'disabled'], isDisabled);
      }
    });
  }
  return tempState;
}

export default function usersReducer(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'init': {
      let tempState = reducerInitToMap(payload, 'users', state);
      tempState = tempState.set('USOFI', fromJS(payload.sofi));
      if(payload.me.organizations[0]){
        tempState = updateStateFromOrg(tempState, payload.me.organizations[0]);
      }

      return tempState;
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
    case 'organizations.enableUser':
    case 'organizations.disableUser':
    case 'organization_updated': {
      let tempState = updateStateFromOrg(state, payload.organization);
      return tempState;
    }
    case types.RESET_STATE: {
      return initialState;
    }
    default:
      return state;
  }
}
