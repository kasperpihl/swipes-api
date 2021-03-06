import { combineReducers } from 'redux';
import * as coreReducers from 'swipes-core-js/reducers';
import main from './main';
import navigation from './navigation';
import modals from './modals';
import infoTab from './infotab';


const rootReducer = combineReducers({
  ...coreReducers,
  main,
  navigation,
  modals,
  infoTab,
});

export default rootReducer;
