import { combineReducers } from 'redux-immutable';

import main from './main';
import navigation from './navigation';
import modal from './modal';
import routing from './routing';
import toasty from './toasty';
import search from './search';

import me from './me';
import services from './services';
import activity from './activity';
import users from './users';
import goals from './goals';
import notes from './notes';
import workflows from './workflows';


const rootReducer = combineReducers({
  main,
  navigation,
  modal,
  toasty,
  routing,
  search,

  me,
  goals,
  services,
  notes,
  activity,
  users,
  workflows,
});

export default rootReducer;
