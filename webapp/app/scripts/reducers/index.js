import { combineReducers } from 'redux'
import main from './main'
import modal from './modal'
import workspace from './workspace'
import services from './services'
import me from './me'

const rootReducer = combineReducers({
  main,
  modal,
  workspace,
  services,
  me
})

export default rootReducer