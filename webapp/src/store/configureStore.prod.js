
import {compose, applyMiddleware, createStore} from 'redux';
import * as types from '../constants/ActionTypes'

// API middleware + hack to work with Babel 6
import { apiMiddleware } from 'redux-api-middleware';

import persistState from 'redux-localstorage'
import thunk from 'redux-thunk';
import Immutable, { fromJS } from 'immutable'

import rootReducer from '../reducers'

// Define what's saved from state to LocalStorage
const persist = paths => {
  return state => {
    return Immutable.Map({
      main: {
        token: state.getIn(['main', 'token']) || null,
        tileBaseUrl: state.getIn(['main','tileBaseUrl']) || null
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
  key: 'redux', 
  slicer: persist
}
export default function configureStore(preloadedState) {
  // All the keys to persist to localStorage between opens
  const enhancer = compose(
    applyMiddleware(
      thunk,
      apiMiddleware
    ),
    persistState(null, localStorageConfig)
  )
  return createStore(
    rootReducer,
    preloadedState,
    enhancer 
  );
}
