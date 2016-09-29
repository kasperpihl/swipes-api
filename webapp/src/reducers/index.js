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
import users from './users'

const rootReducer = combineReducers({
  main,
  modal,
  overlays,
  notifications,
  routing,

  me,
  workspace,
  services,
  activity,
  users
})

export default rootReducer
