const ignoredActions = ['API_REQUEST', 'API_SUCCESS']; // Ignore actions from Logger
import createLogger from 'redux-logger';

export default {
  middlewares: [
    createLogger(
      {
        stateTransformer: state => state.toJS(),
        collapsed: true,
        duration: true,
        diff: true,
        predicate: (getState, action) => (ignoredActions.indexOf(action.type) === -1),
      },
    ),
  ],
};
