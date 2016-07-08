import {compose, createStore} from 'redux';
import persistState from 'redux-localstorage'

import rootReducer from '../reducers'
const addLoggingToDispatch = (store) => {
  /* eslint-disable no-console */
  const rawDispatch = store.dispatch;
  if (!console.group) {
    return rawDispatch;
  }

  return (action) => {
    console.group(action.type);
    console.log('%c prev state', 'color: gray', store.getState());
    console.log('%c action', 'color: blue', action);
    const returnValue = rawDispatch(action);
    console.log('%c next state', 'color: green', store.getState());
    console.groupEnd(action.type);
    return returnValue;
  };
  /* eslint-enable no-console */
};

export default function configureStore(preloadedState) {
  // All the keys to persist to localStorage between opens
  const enhancer = compose(
    persistState(['auth'])
  )
  const store = createStore(
    rootReducer,
    preloadedState,
    enhancer
  );
  store.dispatch = addLoggingToDispatch(store);
  return store
}