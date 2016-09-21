import * as types from '../constants/ActionTypes'
import clone from 'clone'

const initialState = {
  shown: false
}

export default function modal (state = initialState, action) {
  switch (action.type) {
    case types.LOAD_MODAL:{
      let newState = clone(initialState)
      newState.shown = true;
      newState.data = action.data || {}
      newState.callback = action.callback || null 
      return newState;
    }
    case types.HIDE_MODAL:{
      return clone(initialState)
    }
    default: 
      return state
  }
}