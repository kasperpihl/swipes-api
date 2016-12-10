import { fromJS, Map } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({
  socketUrl: null,
  token: null,
  overlay: null,
  cache: {},
  hasLoaded: false,
  activeGoal: null,
});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case 'rtm.start': {
      if (!payload.ok) {
        return state;
      }
      return state.withMutations(ns => ns.set('socketUrl', payload.ws_url));
    }

    case types.SET_STATUS: {
      const hasLoaded = (state.get('hasLoaded') || action.status === 'online') ? true : null;
      return state.withMutations(ns => ns.set('hasLoaded', hasLoaded).set('status', action.status));
    }

    // ======================================================
    // Caching
    // ======================================================
    case types.CACHE_SAVE: {
      return state.setIn(['cache', action.index], action.data);
    }
    case types.CACHE_REMOVE: {
      return state.deleteIn(['cache', action.index]);
    }
    case types.CACHE_CLEAR: {
      return state.set('cache', initialState.get('cache'));
    }


    // ======================================================
    // Overlays
    // ======================================================
    case types.OVERLAY_SHOW: {
      return state.set('overlay', payload.overlay);
    }
    case types.OVERLAY_HIDE: {
      return state.set('overlay', null);
    }

    // ======================================================
    // Authorization methods
    // ======================================================
    case 'users.signin':
    case 'users.signup': {
      if (!action.payload || !payload.ok) {
        return state;
      }
      return state.set('token', payload.token);
    }
    case types.LOGOUT: {
      return initialState;
    }


    default:
      return state;
  }
}
