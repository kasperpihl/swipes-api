import { compose, applyMiddleware, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import { persistStore, autoRehydrate } from 'redux-persist-immutable';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import { Map } from 'immutable';
import rootReducer from 'reducers';

export default function configureStore(preloadedState) {
  preloadedState = Map();
  const ignoredActions = ['API_REQUEST', 'API_SUCCESS']; // Ignore actions from Logger
  // All the keys to persist to localStorage between opens
  const enhancer = compose(
    applyMiddleware(
      thunk,
      apiMiddleware,
      createLogger(
        {
          stateTransformer: state => state.toJS(),
          collapsed: true,
          duration: true,
          diff: true,
          predicate: (getState, action) => (ignoredActions.indexOf(action.type) === -1),
        },
      ),
    ),
    autoRehydrate(),
  );

  const store = createStore(
    rootReducer,
    preloadedState,
    enhancer,
  );

  persistStore(store, {
    blacklist: ['main'],
  });

  return store;
}
