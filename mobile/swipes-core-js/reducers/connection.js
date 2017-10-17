import { fromJS } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import * as types from '../constants';

const initialState = fromJS({
  lastConnect: null,
  lastVersion: null,
  token: null,
  forceFullFetch: false,
  readyInOrg: false,
  hasConnected: false,
  notificationCounter: 0,
  status: 'offline',
  versionInfo: {},
});
const forceRefresh = (state) => state.set('lastConnect', null)
                                    .set('forceFullFetch', true)
                                    .set('hasConnected', false)
                                    .set('readyInOrg', false);

export default function connectionReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case ('init'): {
      return state.set('lastConnect', payload.timestamp)
                  .set('forceFullFetch', false)
                  .set('hasConnected', true)
                  .set('readyInOrg', payload.me.has_organization);
    }
    case REHYDRATE:
      if (action && action.payload && action.payload.connection) {
        const { connection } = action.payload;
        if(connection.get('token')) {
          return initialState.set('token', connection.get('token'))
            .set('lastConnect', connection.get('lastConnect'))
            .set('lastVersion', connection.get('lastVersion'))
            .set('hasConnected', connection.get('hasConnected'))
            .set('readyInOrg', connection.get('readyInOrg'));
        }
        return initialState;
        
      }
      return state;
    case types.SET_LAST_VERSION: {
      if(state.get('lastVersion') === payload.version) {
        return state;
      }
      return forceRefresh(state.set('lastVersion', payload.version));
    }
    case types.SET_UPDATE_STATUS: {
      return state.mergeIn(['versionInfo'], fromJS(payload));
    }
    case types.SET_CONNECTION_STATUS: {
      return state.set('status', payload.status)
        .set('nextRetry', payload.nextRetry)
        .set('reconnectAttempt', payload.reconnectAttempt);
    }
    case types.UPDATE_NOTIFICATION_COUNTER: {
      return state.set('notificationCounter', payload.counter);
    }
    // ======================================================
    // Authorization methods
    // ======================================================
    case 'organizations.delete':
    case 'organizations.leave':
    case 'organizations.create':
    case 'organizations.join':
    case 'organization_created': {
      return forceRefresh(state);
    }
    case 'users.signin':
    case 'users.signup': {
      return state.set('token', payload.token);
    }
    case types.RESET_STATE: {
      return initialState;
    }
    default:
      return state;
  }
}
