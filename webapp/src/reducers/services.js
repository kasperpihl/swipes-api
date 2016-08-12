import * as types from '../constants/ActionTypes'

const initialState = {};

export default function services (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        const services = {}
        res.services.forEach((service) => {
          services[service.id] = service;
        })
        return services;
      }
      return state;
    }
    default: 
      return state
  }
}