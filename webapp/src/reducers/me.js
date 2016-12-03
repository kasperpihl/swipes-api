import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({});

export default function me(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case ('rtm.start'): {
      if (payload.ok) {
        return fromJS(payload.self);
      }
      return state;
    }
    case ('profile_pic_update'): {
      return state;
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
    case types.LOGOUT: {
      return initialState;
    }
    default:
      return state;
  }
}
