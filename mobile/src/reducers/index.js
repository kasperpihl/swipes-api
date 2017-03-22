import { combineReducers } from 'redux-immutable';
import * as coreReducers from '../../swipes-core-js/reducers';
import main from './main';


const rootReducer = combineReducers({
  ...coreReducers,
  main,
});

export default rootReducer;
