import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import immutableTransform from 'redux-persist-transform-immutable';
import storage from 'redux-persist/lib/storage';

import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import devConf from './configureStore.dev';

let config = {
  middlewares: [
    thunk,
  ],
  persistConfig: {
    storage,
    transforms: [immutableTransform()],
    whitelist: ['auth'],
    key: 'root2',
  },
};

if (__DEV__) {
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
