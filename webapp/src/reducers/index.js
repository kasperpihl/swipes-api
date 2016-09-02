import { combineReducers } from 'redux'
import main from './main'
import modal from './modal'
import workspace from './workspace'
import services from './services'
import activity from './activity'
import notifications from './notifications'

import me from './me'

const rootReducer = combineReducers({
  main,
  modal,
  workspace,
  services,
  activity,
  notifications,
  me
})

export default rootReducer