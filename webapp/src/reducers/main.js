import { fromJS, Map } from 'immutable';
import * as types from 'constants';
import { REHYDRATE } from 'redux-persist/constants';
import { randomString } from 'classes/utils';

const initialState = fromJS({
  overlay: null,
  isHydrated: false,
  versionInfo: {},
});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case REHYDRATE:
      return state.set('isHydrated', true);
    case types.SET_UPDATE_STATUS: {
      return state.mergeIn(['versionInfo'], fromJS(payload));
    }
    case types.SET_MAXIMIZED: {
      return state.set('isMaximized', payload.toggle);
    }
    case types.SET_FULLSCREEN: {
      return state.set('isFullscreen', payload.toggle);
    }

    case types.SLACK_OPEN_IN: {
      return state.set('slackOpenIn', payload.id);
    }

    // ======================================================
    // Tooltips
    // ======================================================
    case types.TOOLTIP: {
      return state.set('tooltip', payload);
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
      const pl = payload && Object.assign({}, payload, { id: randomString(5) });
      return state.set('contextMenu', pl);
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

    default:
      return state;
  }
}
