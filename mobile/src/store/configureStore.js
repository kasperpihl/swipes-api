import { compose, applyMiddleware, createStore } from 'redux';
import { AsyncStorage } from 'react-native';
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
    storage: AsyncStorage,
    blacklist: ['notes', 'navigation', 'filters', 'main', 'loading', 'autoComplete', 'infoTab'],
  });

  return store;
}
