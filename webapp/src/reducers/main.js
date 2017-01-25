import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({
  socketUrl: null,
  token: null,
  overlay: null,
  cache: {},
  services: {},
  ways: {},
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
      return state.withMutations((ns) => {
        // ways
        const ways = {};
        payload.ways.forEach((w) => { ways[w.id] = w; });
        ns.set('ways', fromJS(ways));
        // services
        const services = {};
        payload.services.forEach((s) => { services[s.id] = s; });
        ns.set('services', fromJS(services));
        // socket url
        ns.set('socketUrl', payload.ws_url);
      });
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
    case types.OVERLAY: {
      return state.set('overlay', payload);
    }

    // ======================================================
    // Context Menu
    // ======================================================
    case types.CONTEXT_MENU: {
      return state.set('contextMenu', payload);
    }

    // ======================================================
    // Update Recent
    // ======================================================
    case types.UPDATE_RECENT_ASSIGNEES: {
      let currentCache = state.get('recentAssignees');
      if (currentCache) {
        currentCache = currentCache.toJS();
      }
      currentCache = currentCache || [];

      return state.set('recentAssignees', fromJS([...new Set(payload.concat(currentCache))]));
    }

    // ======================================================
    // Preview
    // ======================================================
    case types.PREVIEW_LOADING: {
      return state.set('preview', { loading: true });
    }
    case types.PREVIEW: {
      return state.set('preview', payload);
    }

    // ======================================================
    // Note
    // ======================================================
    case types.NOTE_SHOW: {
      const { id } = payload;
      const newVal = (state.get('sideNoteId') === id) ? null : id;
      return state.set('sideNoteId', newVal);
    }
    case types.NOTE_HIDE: {
      return state.set('sideNoteId', null);
    }

    // ======================================================
    // Ways
    // ======================================================
    case 'way_created': {
      return state.setIn(['ways', payload.data.id], fromJS(payload.data));
    }
    case 'ways.create': {
      return state.setIn(['ways', payload.way.id], fromJS(payload.way));
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
