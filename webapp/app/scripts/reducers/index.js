import { combineReducers } from 'redux'
import main from './main'
import modal from './modal'
import auth from './auth'

const rootReducer = combineReducers({
  main,
  modal,
  auth
})

export default rootReducer