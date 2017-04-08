import { compose, applyMiddleware, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
import { persistStore, autoRehydrate } from 'redux-persist-immutable';
import thunk from 'redux-thunk';
import { Map } from 'immutable';
import rootReducer from '../reducers';
import dev from './configureStore.dev';

const isProd = !__DEV__;
const middlewares = isProd ? [] : dev.middlewares;

export default function configureStore(preloadedState) {
  preloadedState = Map();

  const enhancer = compose(
    applyMiddleware(
      thunk,
      ...middlewares,
    ),
    autoRehydrate(),
  );

  const store = createStore(
    rootReducer,
    preloadedState,
    enhancer,
  );

  persistStore(store, {
    storage: AsyncStorage,
    blacklist: ['notes', 'navigation', 'filters', 'modals'],
  });

  return store;
}
