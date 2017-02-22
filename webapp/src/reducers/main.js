import { fromJS, Map } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({
  socketUrl: null,
  token: null,
  overlay: null,
  cache: {},
  services: {},
  milestones: {},
  versionInfo: {

  },
  notifications: [],
  ways: {},
  hasLoaded: false,
  activeGoal: null,
});

const shouldKeepNotification = payload => [
  'step_got_active',
  'goal_notify',
  'goal_completed',
  'goal_created',
].indexOf(payload.type) !== -1;

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

        // milestones
        const milestones = {};
        payload.milestones.forEach((m) => { milestones[m.id] = m; });
        ns.set('milestones', fromJS(milestones));

        // services
        const services = {};
        payload.services.forEach((s) => { services[s.id] = s; });
        ns.set('services', fromJS(services));
        // notifications
        ns.set('notifications', fromJS(payload.notifications.filter(n => shouldKeepNotification(n))));
        // socket url
        ns.set('socketUrl', payload.ws_url);
      });
    }

    case types.SET_STATUS: {
      const hasLoaded = (state.get('hasLoaded') || payload.status === 'online') ? true : null;
      return state.withMutations(ns =>
        ns.set('hasLoaded', hasLoaded).set('status', payload.status).set('nextRetry', payload.nextRetry),
      );
    }
    case types.SET_UPDATE_STATUS: {
      return state.mergeIn(['versionInfo'], payload);
    }
    case types.SET_MAXIMIZED: {
      return state.set('isMaximized', payload.toggle);
    }
    case types.SET_FULLSCREEN: {
      return state.set('isFullscreen', payload.toggle);
    }

    // ======================================================
    // Caching
    // ======================================================
    case types.CACHE_SAVE: {
      return state.setIn(['cache', payload.index], payload.data);
    }
    case types.CACHE_REMOVE: {
      return state.deleteIn(['cache', payload.index]);
    }
    case types.CACHE_CLEAR: {
      return state.set('cache', initialState.get('cache'));
    }

    case types.SLACK_OPEN_IN: {
      return state.set('slackOpenIn', payload.id);
    }
    case types.SET_SLACK_URL: {
      return state.set('slackUrl', payload.url);
    }

    // ======================================================
    // Notifications
    // ======================================================
    case types.NOTIFICATION_ADD: {
      if (!shouldKeepNotification(payload)) {
        return state;
      }
      return state.updateIn(['notifications'], s => s.insert(0, fromJS(payload)));
    }
    case 'notifications_seen':
    case 'notifications.markAsSeen': {
      const { marked_at, last_marked: lastMarked } = payload.data || payload;
      return state.updateIn(['notifications'], s => s.map((n) => {
        if (n.get('ts') <= lastMarked) {
          return n.set('seen', marked_at);
        }
        return n;
      }));
    }

    // ======================================================
    // Overlays
    // ======================================================
    case types.OVERLAY: {
      return state.set('overlay', payload);
    }

    // ======================================================
    // Modals
    // ======================================================
    case types.MODAL: {
      return state.set('modal', payload);
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
      return state.set('preview', Map({ loading: true }));
    }
    case types.PREVIEW: {
      return state.set('preview', Map(payload));
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
      if (!payload.ok) {
        return state;
      }
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
