import { combineReducers } from 'redux-immutable';
import * as coreReducers from 'swipes-core-js/reducers';
import main from './main';
import navigation from './navigation';
import routing from './routing';
import toasty from './toasty';
import search from './search';

const rootReducer = combineReducers({
  ...coreReducers,
  main,
  navigation,
  toasty,
  routing,
  search,
});

export default rootReducer;
