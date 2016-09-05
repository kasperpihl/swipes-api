import {compose, applyMiddleware, createStore } from 'redux';
import * as types from '../constants/ActionTypes'

// API middleware
import { apiMiddleware } from 'redux-api-middleware';
import { persistState as persistStateDevtools } from 'redux-devtools'
const devtool = require('../DevTools');

import persistState from 'redux-localstorage'
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';


import rootReducer from '../reducers'

// Define what's saved from state to LocalStorage
const persist = paths => {
  return state => {
    return {
      main: {
        token: state.main ? state.main.token : null,
        tileBaseUrl: state.main ? state.main.tileBaseUrl : null
      },
      services: state.services,
      workspace: state.workspace,
      me: state.me
    }
  }
}
export default function configureStore(preloadedState) {

  const ignoredActions = [types.DRAG_DOT]; // Ignore actions from Logger
  // All the keys to persist to localStorage between opens
  const enhancer = compose(
    applyMiddleware(
      thunk,
      apiMiddleware,
      createLogger({collapsed: true, duration: true, diff: true, predicate: (getState, action) => (ignoredActions.indexOf(action.type) === -1)
      })
    ),
    persistState(null, {key: 'redux-dev', slicer: persist}),
    devtool.instrument(),
    persistStateDevtools(getDebugSessionKey())
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
