import * as types from '../constants/ActionTypes'

const initialState = {
  token: null
}

export default function auth (state = initialState, action) {
  switch (action.type) {
    case ('users.login'):
    case ('users.signup'):{
      if(action.payload && action.payload.ok){
        return Object.assign({}, {token: action.payload.token});
      }
      console.log('result', action, state);
      // K_TODO: Handle error
      return state;
    }
    case types.LOGOUT:{
      return Object.assign({}, initialState)
    }
    default: 
      return state
  }
}