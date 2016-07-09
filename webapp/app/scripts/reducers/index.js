import { combineReducers } from 'redux'
import main from './main'
import modal from './modal'
import auth from './auth'
import tiles from './tiles'
import services from './services'
import me from './me'

const rootReducer = combineReducers({
  main,
  modal,
  auth,
  tiles,
  services,
  me
})

export default rootReducer