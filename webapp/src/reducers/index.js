import { combineReducers } from 'redux-immutable'
import main from './main'
import modal from './modal'
import workspace from './workspace'
import services from './services'
import activity from './activity'
import notifications from './notifications'
import templates from './templates'
import users from './users'
import routing from './routing'
import { routerReducer } from 'react-router-redux'

import me from './me'

const rootReducer = combineReducers({
  activity,
  main,
  routing,
  services,
  me,
  workspace,
  modal,
  notifications,
  templates,
  users
  /*
  
  */
})

export default rootReducer
