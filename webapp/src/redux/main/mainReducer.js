import { fromJS } from 'immutable';
import * as types from '../constants';
import { REHYDRATE } from 'redux-persist';
import randomString from 'core/utils/randomString';

const initialState = fromJS({
  overlay: null,
  selectedTeamId: null,
  isHydrated: false,
  successState: false,
  modals: {
    primary: null,
    secondary: null
  },
  dragAndDrop: {
    global: [],
    primary: [],
    secondary: []
  }
});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case REHYDRATE:
      return state.set('isHydrated', true);
    case 'me.init': {
      let selectedTeamId = payload.me.user_id;
      if (payload.teams.length) {
        selectedTeamId = payload.teams[0].team_id;
      }
      return state.set('selectedTeamId', selectedTeamId);
    }
    case types.SET_SELECTED_TEAM_ID: {
      return state.set('selectedTeamId', payload.selectedTeamId);
    }
    case types.SET_MAXIMIZED: {
      return state.set('isMaximized', payload.toggle);
    }
    case types.SET_FULLSCREEN: {
      return state.set('isFullscreen', payload.toggle);
    }

    case types.SIDEBAR_SET_EXPANDED: {
      return state.set('sidebarExpanded', payload.sidebarExpanded);
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
    case types.NAV_PUSH:
    case types.NAV_SET:
    case types.NAV_POP: {
      return state.setIn(['modals', payload.side], null);
    }
    case types.NAV_MODAL: {
      const modal = payload.component
        ? {
            component: payload.component,
            props: payload.props || {}
          }
        : null;
      return state.setIn(['modals', payload.side], modal);
    }

    // ======================================================
    // Context Menu
    // ======================================================
    case types.CONTEXT_MENU: {
      const pl = payload && Object.assign({}, payload, { id: randomString(5) });
      return state.set('contextMenu', pl);
    }

    // ======================================================
    // Success animation
    // ======================================================
    case types.SUCCESS_GRADIENT: {
      return state
        .set('successState', new Date())
        .set('successColor', payload.color || 'green');
    }

    default:
      return state;
  }
}
