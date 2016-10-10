import {compose, applyMiddleware, createStore } from 'redux';
import * as types from '../constants/ActionTypes'

// API middleware
import { apiMiddleware } from 'redux-api-middleware';
import { persistState as persistStateDevtools } from 'redux-devtools'
const devtool = require('../DevTools');

import persistState from 'redux-localstorage'
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import Immutable, { fromJS } from 'immutable'

import rootReducer from '../reducers'

// Define what's saved from state to LocalStorage
const persist = paths => {
  return state => {
    return Immutable.Map({
      main: {
        token: state.getIn(['main', 'token']) || null
      },
      services: state.get('services'),
      workspace: state.get('workspace'),
      me: state.get('me')
    })
  }
}
const localStorageConfig = {
  serialize: (subset) => JSON.stringify(subset.toJS()),
  deserialize: (serializedData) => fromJS(JSON.parse(serializedData)),
  merge: (initialState, persistedState) => initialState.mergeDeep(persistedState),
  key: 'redux-dev', 
  slicer: persist
}
export default function configureStore(preloadedState) {
  preloadedState = Immutable.Map();
  const ignoredActions = []; // Ignore actions from Logger
  // All the keys to persist to localStorage between opens
  const enhancer = compose(
    applyMiddleware(
      thunk,
      apiMiddleware,
      createLogger({stateTransformer: (state) => state.toJS(), collapsed: true, duration: true, diff: true, predicate: (getState, action) => (ignoredActions.indexOf(action.type) === -1)
      })
    ),
    persistState(null, localStorageConfig)
  )
  return createStore(
    rootReducer,
    preloadedState,
    enhancer 
  );
}

function getDebugSessionKey() {
  // You can write custom logic here!
  // By default we try to read the key from ?debug_session=<key> in the address bar
  const matches = window.location.href.match(/[?&]debug_session=([^&#]+)\b/);
  return (matches && matches.length > 0)? matches[1] : null;
}
