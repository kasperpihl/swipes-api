import { fromJS } from 'immutable';
import * as types from 'constants';
import { REHYDRATE } from 'redux-persist/constants';

const initialState = fromJS({
  lastConnect: null,
  token: null,
  status: 'offline',
});

export default function me(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case ('rtm.start'): {
      return state.set('lastConnect', payload.ts);
    }
    case REHYDRATE:
      if (action && action.payload && action.payload.connection) {
        return action.payload.connection.set('lastConnect', null).set('status', 'offline');
      }
      return state;
    case types.SET_STATUS: {
      return state.set('status', payload.status).set('nextRetry', payload.nextRetry);
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
