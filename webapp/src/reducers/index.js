import { combineReducers } from 'redux-immutable';

import main from './main';
import modal from './modal';
import overlays from './overlays';
import notifications from './notifications';
import routing from './routing';
import toasty from './toasty';
import search from './search';

import me from './me';
import services from './services';
import activity from './activity';
import users from './users';
import goals from './goals';
import workflows from './workflows';


const rootReducer = combineReducers({
  main,
  modal,
  overlays,
  notifications,
  toasty,
  routing,
  search,

  me,
  goals,
  services,
  activity,
  users,
  workflows,
});

export default rootReducer;
