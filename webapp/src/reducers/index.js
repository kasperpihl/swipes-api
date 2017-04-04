import { combineReducers } from 'redux-immutable';
import * as coreReducers from 'swipes-core-js/reducers';
import main from './main';
import navigation from './navigation';
import routing from './routing';
import search from './search';

const rootReducer = combineReducers({
  ...coreReducers,
  main,
  navigation,
  routing,
  search,
});

export default rootReducer;
