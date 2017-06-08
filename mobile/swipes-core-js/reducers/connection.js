import { fromJS } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import * as types from '../constants';
import { hasMinorChange } from '../classes/utils';

const initialState = fromJS({
  lastConnect: null,
  lastVersion: null,
  token: null,
  ready: false,
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
                  .set('lastVersion', window.__VERSION__)
                  .set('ready', true);
    }
    case REHYDRATE:
      if (action && action.payload && action.payload.connection) {
        const { connection } = action.payload;

        return initialState.set('token', connection.get('token'))
                 .set('lastConnect', connection.get('lastConnect'))
                 .set('lastVersion', connection.get('lastVersion'))
                 .set('ready', window.__VERSION__ === connection.get('lastVersion'));
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
    default:
      return state;
  }
}
