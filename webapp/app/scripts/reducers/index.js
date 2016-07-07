import { combineReducers } from 'redux'
import main from './main'
import modal from './modal'

const rootReducer = combineReducers({
  main,
  modal
})

export default rootReducer