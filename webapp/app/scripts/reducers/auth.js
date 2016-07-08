import * as types from '../constants/ActionTypes'

const initialState = {
  token: null
}

export default function auth (state = initialState, action) {
  switch (action.type) {
    case types.LOGIN:{
      return Object.assign({}, {token: action.token})
    }
    case types.LOGOUT:{
      return Object.assign({}, initialState)
    }
    default: 
      return state
  }
}