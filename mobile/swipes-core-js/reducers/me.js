import { fromJS } from 'immutable';

const initialState = fromJS({});

export default function me(state = initialState, action) {
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
    case 'me.updateProfile':
    case 'profile_updated': {
      return state.mergeIn(['profile'], fromJS(payload.profile));
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
    default:
      return state;
  }
}
