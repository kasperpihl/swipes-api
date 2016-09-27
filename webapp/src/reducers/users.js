import * as types from '../constants/ActionTypes'
import clone from 'clone'
const initialState = {};

export default function services (state = initialState, action) {
  switch (action.type) {
    case ('rtm.start'):{
      const res = action.payload;
      if(res.ok){
        const users = {}
        res.users.forEach((user) => {
          users[user.id] = user;
        })
        return users;
      }
      return state;
    }
    case types.LOGOUT:{
      return clone(initialState);
    }
    default: 
      return state
  }
}