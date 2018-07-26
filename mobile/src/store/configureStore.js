import { applyMiddleware, createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
import immutableTransform from 'redux-persist-transform-immutable'
import { AsyncStorage, Platform } from 'react-native';

import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import devConf from './configureStore.dev';

let config = {
  middlewares: [
    thunk,
  ],
  persistConfig: {
    transforms: [immutableTransform()],
    blacklist: ['notes', 'navigation', 'main', 'autoComplete', 'infoTab', 'globals'],
    key: 'root',
    storage: AsyncStorage,
  }
};

if(__DEV__) {
  config = devConf(config);
}

export default function configureStore(preloadedState = {}) {

  const store = createStore(
    persistReducer(config.persistConfig, rootReducer),
    preloadedState,
    applyMiddleware(
      ...config.middlewares,
    ),
  );

  const persistor = persistStore(store);

  return {
    persistor,
    store,
  };
}
