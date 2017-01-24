import { combineReducers } from 'redux-immutable';

import main from './main';
import navigation from './navigation';
import modal from './modal';
import routing from './routing';
import toasty from './toasty';
import search from './search';

import me from './me';
import users from './users';
import goals from './goals';
import notifications from './notifications';
import notes from './notes';


const rootReducer = combineReducers({
  main,
  navigation,
  modal,
  toasty,
  routing,
  search,

  me,
  goals,
  notes,
  notifications,
  users,
});

export default rootReducer;
