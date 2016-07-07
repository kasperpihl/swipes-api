import * as types from '../constants/ActionTypes'

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
      let newState = Object.assign({}, initialState, getModalOptions(action.modal))
      newState.viewName = action.modal
      newState.data = action.options || null
      newState.callback = action.callback || null 
      return newState;
    }
    case types.HIDE_MODAL:{
      return Object.assign({}, initialState)
    }
    default: 
      return state
  }
}

const getModalOptions = (modal) => {
  let options = {};
  if(modal === "search"){
    options.top = "15%";
    options.centerY = false;
  }
  return options;
}