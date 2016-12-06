import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({});

export default function servicesReducer(state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'): {
      const res = action.payload;
      if (res.ok) {
        const services = {};
        res.services.forEach((service) => {
          services[service.id] = service;
        });
        return fromJS(services);
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
