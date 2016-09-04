import { combineReducers } from 'redux'
import main from './main'
import modal from './modal'
import workspace from './workspace'
import services from './services'
import activity from './activity'
import notifications from './notifications'
import { routerReducer } from 'react-router-redux'

import me from './me'

const rootReducer = combineReducers({
  main,
  modal,
  workspace,
  services,
  activity,
  notifications,
  me,
  routing: routerReducer
})

export default rootReducer
