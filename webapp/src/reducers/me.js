import * as types from '../constants/ActionTypes'

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
      return Object.assign({}, state, {services: [...state.services, msg.data]})
    }
    case 'service_changed':{
      const msg = action.payload;
      let newServices = state.services.map((service) => {
        if(service.id === msg.data.id && service.service_name === msg.data.service_name){
          return Object.assign({}, service, msg.data);
        }
        return service;
      })
      return Object.assign({}, state, {services: newServices});
    }
    case 'service_removed':{
      const msg = action.payload;
      let newServices = state.services.filter((service) => {
        return (service.id === msg.data.id && service.service_name === msg.data.service_name);
      })
      return Object.assign({}, state, {services: newServices});
    }
    default: 
      return state
  }
}