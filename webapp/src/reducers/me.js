import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'
const initialState = fromJS({});

export default function me (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        return fromJS(res.self);
      }
      return state;
    }
    // handle service_added/removed etc from socket.
    case 'service_added':{
      const service = fromJS(action.payload.data);
      return state.updateIn(['services'], (services) => services.push(service))
    }
    case 'service_changed':{
      const msg = action.payload;
      return state.updateIn(['services'], (services) => services.map((service) => {
        if(service.get('id') === msg.data.id){
          return service.merge(msg.data);
        }
        return service;
      }))
    }
    case 'service_removed':{
      const msg = action.payload;
      return state.updateIn(['services'], (services) => services.filter((service) => (service.get('id') !== msg.data.id)))
    }
    case types.LOGOUT:{
      return initialState;
    }
    default: 
      return state
  }
}