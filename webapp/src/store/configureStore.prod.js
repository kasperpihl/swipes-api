
import {compose, applyMiddleware, createStore} from 'redux';
import * as types from '../constants/ActionTypes'

// API middleware + hack to work with Babel 6
import { apiMiddleware } from 'redux-api-middleware';

import persistState from 'redux-localstorage'
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';


import rootReducer from '../reducers'

// Define what's saved from state to LocalStorage
const persist = paths => {
  return state => {
    return {
      main: {
        token: state.main.token,
        tileBaseUrl: state.main.tileBaseUrl
      },
      services: state.services,
      workspace: state.workspace,
      me: state.me
    }
  }
}
export default function configureStore(preloadedState) {
  // All the keys to persist to localStorage between opens
  const enhancer = compose(
    applyMiddleware(
      thunk,
      apiMiddleware
    ),
    persistState(null, {slicer: persist})
  )
  return createStore(
    rootReducer,
    preloadedState,
    enhancer 
  );
}
