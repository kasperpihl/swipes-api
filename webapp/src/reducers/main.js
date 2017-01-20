import { fromJS } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({
  socketUrl: null,
  token: null,
  overlay: null,
  cache: {},
  links: {},
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
    // Preview
    // ======================================================
    case types.PREVIEW_LOADING: {
      return state.set('preview', { loading: true });
    }
    case types.PREVIEW: {
      return state.set('preview', payload);
    }

    // ======================================================
    // Links
    // ======================================================
    case types.LOAD_LINKS: {
      let links = fromJS({});
      payload.forEach((l) => {
        if (l.last_updated !== state.getIn(['links', l.short_url, 'last_updated'])) {
          links = links.set(l.short_url, fromJS(l));
        }
      });
      return links.size ? state.mergeIn(['links'], links) : state;
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
