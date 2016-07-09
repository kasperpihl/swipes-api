import {compose, applyMiddleware, createStore} from 'redux';


// API middleware + hack to work with Babel 6
import { apiMiddleware } from 'redux-api-middleware';


import persistState from 'redux-localstorage'
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';


import rootReducer from '../reducers'

export default function configureStore(preloadedState) {
  // All the keys to persist to localStorage between opens
  const enhancer = compose(
    applyMiddleware(
      thunk,
      apiMiddleware,
      createLogger()
    ),
    persistState(['auth'])
  )
  return createStore(
    rootReducer,
    preloadedState,
    enhancer 
  );
}
