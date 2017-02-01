import { combineReducers } from 'redux-immutable';

import main from './main';
import navigation from './navigation';
import routing from './routing';
import toasty from './toasty';
import search from './search';

import me from './me';
import users from './users';
import goals from './goals';
import notes from './notes';


const rootReducer = combineReducers({
  main,
  navigation,
  toasty,
  routing,
  search,

  me,
  goals,
  notes,
  users,
});

export default rootReducer;
