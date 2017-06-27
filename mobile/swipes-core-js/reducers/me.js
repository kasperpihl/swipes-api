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
    case 'organizations.promoteToAdmin':
    case 'organizations.demoteAnAdmin': {
      return state.updateIn(['organizations', 0], (org) => {
        return org.set('admins', fromJS(payload.admins)).set('updated_at', payload.updated_at);
      })
    }
    case 'organizations.createStripeCustomer': {
      return state.updateIn(['organizations', 0], (org) => {
        return org.set('plan', payload.plan).set('stripe_customer_id', payload.stripe_customer_id);
      })
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
