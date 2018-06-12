import { compose, applyMiddleware, createStore } from 'redux';
import { AsyncStorage, Platform } from 'react-native';
import FilesystemStorage from 'redux-persist-filesystem-storage';

import { persistStore, autoRehydrate } from 'redux-persist-immutable';
import thunk from 'redux-thunk';
import { fromJS } from 'immutable';
import rootReducer from '../reducers';
import dev from './configureStore.dev';

const isProd = !__DEV__;
const middlewares = isProd ? [] : dev.middlewares;

export default function configureStore(preloadedState) {
  preloadedState = fromJS(preloadedState || {});

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

  window.persistor = persistStore(store, {
    storage: Platform.OS === 'android' ? FilesystemStorage : AsyncStorage,
    blacklist: ['notes', 'navigation', 'main', 'autoComplete', 'infoTab', 'globals'],
  });

  return store;
}
