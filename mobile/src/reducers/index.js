import { combineReducers } from 'redux-immutable';
import * as coreReducers from '../../swipes-core-js/reducers';
import main from './main';
import navigation from './navigation';


const rootReducer = combineReducers({
  ...coreReducers,
  main,
  navigation
});

export default rootReducer;
