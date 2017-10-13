import { fromJS } from 'immutable';
import * as types from '../constants';

const initialState = fromJS({});

export default function meReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case 'init': {
      return fromJS(payload.me);
    }
    case 'me.updateSettings':
    case 'settings_updated': {
      return state.mergeIn(['settings'], fromJS(payload.settings));
    }
    case 'me.uploadProfilePhoto':
    case 'me.updateProfile':
    case 'profile_updated': {
      if(payload.user_id === state.get('id')){
        return state.mergeIn(['profile'], fromJS(payload.profile));
      }
      return state;
    }
    case 'organizations.inviteUser':
    case 'organizations.enableUser':
    case 'organizations.disableUser':
    case 'organizations.createStripeCustomer':
    case 'organizations.promoteToAdmin':
    case 'organizations.demoteAnAdmin':
    case 'organization_updated': {
      return state.mergeIn(['organizations', 0], fromJS(payload.organization));
    }
    case 'service_added': {
      const service = fromJS(payload);
      return state.updateIn(['services'], services => services.push(service));
    }
    case 'service_changed': {
      return state.updateIn(['services'], services => services.map((service) => {
        if (service.get('id') === payload.id) {
          return service.merge(payload);
        }
        return service;
      }));
    }
    case 'user_invited': {
      const pendings = state.get('pending_organizations');
      if(pendings && !pendings.find((o) => o.get('id') === payload.pending_organization_id)) {
        return state.updateIn(['pending_organizations'], orgs => orgs.push(fromJS({
          id: payload.pending_organization_id,
          name: payload.pending_organization_name,
        })));
      }
      return state;
    }
    case 'service_removed': {
      return state.updateIn(['services'], services => services.filter(service => (service.get('id') !== payload.id)));
    }
    case types.RESET_STATE: {
      return initialState;
    }
    default:
      return state;
  }
}
