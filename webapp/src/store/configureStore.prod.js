import { compose, applyMiddleware, createStore } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import persistState from 'redux-localstorage';
import thunk from 'redux-thunk';
import Immutable, { fromJS } from 'immutable';
import rootReducer from 'src/reducers';

// Define what's saved from state to LocalStorage
const persist = () => state => Immutable.Map({
  main: {
    token: state.getIn(['main', 'token']) || null,
    slackUrl: state.getIn(['main', 'slackUrl']) || null,
    cache: state.getIn(['main', 'cache']) || {},
    services: state.getIn(['main', 'services']) || {},
    milestones: state.getIn(['main', 'milestones']) || {},
    notifications: state.getIn(['main', 'notifications']) || [],
    ways: state.getIn(['main', 'ways']) || {},
    versionInfo: {},
    recentAssignees: state.getIn(['main', 'recentAssignees']) || [],
  },
  goals: state.get('goals'),
  users: state.get('users'),
  notes: state.get('notes'),
  me: state.get('me'),
});
const localStorageConfig = {
  serialize: subset => JSON.stringify(subset.toJS()),
  deserialize: serializedData => fromJS(JSON.parse(serializedData)),
  merge: (initialState, persistedState) => initialState.mergeDeep(persistedState),
  key: 'redux-prod',
  slicer: persist,
};
export default function configureStore(preloadedState) {
  preloadedState = Immutable.Map();
  // All the keys to persist to localStorage between opens
  const enhancer = compose(
    applyMiddleware(
      thunk,
      apiMiddleware,
    ),
    persistState(null, localStorageConfig),
  );
  return createStore(
    rootReducer,
    preloadedState,
    enhancer,
  );
}
