import { fromJS } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import { version } from '../../package.json';
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

export default function connectionReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case ('init'): {
      return state.set('lastConnect', payload.timestamp)
        .set('lastVersion', version)
        .set('forceFullFetch', false)
        .set('hasConnected', true)
        .set('readyInOrg', payload.me.has_organization);
    }
    case REHYDRATE:
      if (action && action.payload && action.payload.connection) {
        const { connection } = action.payload;
        const sameVersion = version === connection.get('lastVersion');
        return initialState.set('token', connection.get('token'))
          .set('lastConnect', connection.get('lastConnect'))
          .set('lastVersion', connection.get('lastVersion'))
          .set('forceFullFetch', !sameVersion)
          .set('hasConnected', sameVersion && connection.get('hasConnected'))
          .set('readyInOrg', sameVersion && connection.get('readyInOrg'));
      }
      return state;
    case types.SET_UPDATE_STATUS: {
      return state.mergeIn(['versionInfo'], fromJS(payload));
    }
    case types.SET_STATUS: {
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
    case 'users.signin':
    case 'users.signup': {
      return state.set('token', payload.token);
    }
    case 'token_revoked': {
      const currToken = state.get('token');
      if (payload.token_to_revoke !== currToken) {
        return state;
      }
      return initialState;
    }
    case types.RESET_STATE: {
      return initialState;
    }
    default:
      return state;
  }
}
