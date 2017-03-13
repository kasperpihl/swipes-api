import { combineReducers } from 'redux-immutable';
import core from './core';
import main from './main';
import navigation from './navigation';
import routing from './routing';
import toasty from './toasty';
import search from './search';

const rootReducer = combineReducers({
  ...core,
  main,
  navigation,
  toasty,
  routing,
  search,
});

export default rootReducer;
