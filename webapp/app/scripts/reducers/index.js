import { combineReducers } from 'redux'
import main from './main'
import modal from './modal'
import auth from './auth'
import workspace from './workspace'
import services from './services'
import me from './me'

const rootReducer = combineReducers({
  main,
  modal,
  auth,
  workspace,
  services,
  me
})

export default rootReducer