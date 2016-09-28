import * as types from '../constants/ActionTypes'
import { fromJS } from 'immutable'

const initialState = fromJS({});

export default function services (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        const services = {}
        res.services.forEach((service) => {
          services[service.id] = service;
        })
        return fromJS(services);
      }
      return state;
    }
    case types.LOGOUT:{
      return initialState;
    }
    default: 
      return state
  }
}