import { combineReducers } from 'redux-immutable'

import main from './main'
import modal from './modal'
import overlays from './overlays'
import notifications from './notifications'
import routing from './routing'


import me from './me'
import workspace from './workspace'
import services from './services'
import activity from './activity'
import templates from './templates'
import users from './users'

const rootReducer = combineReducers({
  activity,
  main,
  overlays,
  routing,
  services,
  me,
  workspace,
  modal,
  notifications,
  templates,
  users
})

export default rootReducer
