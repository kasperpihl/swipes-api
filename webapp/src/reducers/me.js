import * as types from '../constants/ActionTypes'
import clone from 'clone'
const initialState = {};

export default function me (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        return res.self;
      }
      return state;
    }
    // handle service_added/removed etc from socket.
    case 'service_added':{
      const msg = action.payload;
      const newState = clone(state);
      newState.services = [...newState.services, msg.data];
      return newState;
    }
    case 'service_changed':{
      const msg = action.payload;
      const newState = clone(state);
      newState.services = newState.services.map((service) => {
        if(service.id === msg.data.id && service.service_name === msg.data.service_name){
          service = Object.assign(service, msg.data);
        }
        return service;
      })
      return newState;
    }
    case 'service_removed':{
      const msg = action.payload;
      const newState = clone(state);
      newState.services = newState.services.filter((service) => {
        return (service.id === msg.data.id && service.service_name === msg.data.service_name);
      })
      return newState;
    }
    case types.LOGOUT:{
      return clone(initialState);
    }
    default: 
      return state
  }
}