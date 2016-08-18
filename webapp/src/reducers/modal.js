import * as types from '../constants/ActionTypes'
import clone from 'clone'

const initialState = {
  opaqueBackground: true,
  left: "50%",
  top: "50%",
  centerX: true,
  centerY: true
}

export default function modal (state = initialState, action) {
  switch (action.type) {
    case types.LOAD_MODAL:{
      let newState = clone(initialState)
      newState.viewName = action.modal
      newState.data = action.options || {}
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