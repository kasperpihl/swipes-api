import { combineReducers } from 'redux-immutable';
import * as coreReducers from '../../swipes-core-js/reducers';
import main from './main';
import navigation from './navigation';
import modals from './modals';


const rootReducer = combineReducers({
  ...coreReducers,
  main,
  navigation,
  modals,
});

export default rootReducer;
