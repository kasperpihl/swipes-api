import { compose, applyMiddleware, createStore } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist-immutable';
import thunk from 'redux-thunk';
import Immutable, { fromJS } from 'immutable';
import localForage from "localforage";
import rootReducer from 'reducers';
import dev from './configureStore.dev';

const isProd = (process.env.NODE_ENV === 'production');
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

  persistStore(store, {
    storage: localForage,
    blacklist: ['main', 'search', 'filters', 'autoComplete', 'globals'],
  });
  window.getState = store.getState;
  window.localForage = localForage;
  if (!isProd) {
    window.dispatch = store.dispatch;
    window.Immutable = Immutable;
  }
  return store;
}
