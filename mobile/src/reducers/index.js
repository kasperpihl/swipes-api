import { combineReducers } from 'redux-immutable';
import * as coreReducers from '../../swipes-core-js/reducers';
import main from './main';
import navigation from './navigation';
import modals from './modals';
import loading from './loading';
import infoTab from './infotab';


const rootReducer = combineReducers({
  ...coreReducers,
  main,
  navigation,
  modals,
  loading,
  infoTab,
});

export default rootReducer;
