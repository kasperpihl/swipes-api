import { applyMiddleware, createStore, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import storage from 'redux-persist/lib/storage';

import thunk from 'redux-thunk';

import * as reducers from './reducers';
import * as coreReducers from 'swipes-core-js/redux/reducers';

import devConf from './configureStore.dev';

const rootReducer = combineReducers({
  ...coreReducers,
  ...reducers
});

let config = {
  middlewares: [thunk],
  persistConfig: {
    version: 2,
    transforms: [immutableTransform()],
    whitelist: ['navigation', 'auth'],
    key: 'root',
    storage
  }
};

if (process.env.NODE_ENV !== 'production') {
  config = devConf(config);
}

export default function configureStore(preloadedState = {}) {
  const store = createStore(
    persistReducer(config.persistConfig, rootReducer),
    preloadedState,
    applyMiddleware(...config.middlewares)
  );

  const persistor = persistStore(store);
  window.getState = store.getState;

  return {
    persistor,
    store
  };
}
