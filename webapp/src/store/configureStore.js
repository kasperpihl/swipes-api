import { compose, applyMiddleware, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { persistStore, autoRehydrate } from 'redux-persist-immutable';
import thunk from 'redux-thunk';
import { Map } from 'immutable';
import rootReducer from 'reducers';
import dev from './configureStore.dev';

const isProd = (process.env.NODE_ENV === 'production');
const middlewares = isProd ? [] : dev.middlewares;

export default function configureStore(preloadedState) {
  preloadedState = Map();

  const enhancer = compose(
    applyMiddleware(
      thunk,
      apiMiddleware,
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
    blacklist: ['main', 'search', 'toasty'],
  });
  if (!isProd) {
    window.getState = store.getState;
    window.dispatch = store.dispatch;
  }
  return store;
}
