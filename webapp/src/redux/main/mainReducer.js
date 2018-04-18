import { fromJS, Map } from 'immutable';
import * as types from '../constants';
import { REHYDRATE } from 'redux-persist/constants';
import { randomString } from 'swipes-core-js/classes/utils';

const initialState = fromJS({
  overlay: null,
  isHydrated: false,
  successState: false,
  modals: {
    primary: null,
    secondary: null,
  },
});

export default function main(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case REHYDRATE:
      return state.set('isHydrated', true);
    case types.SET_MAXIMIZED: {
      return state.set('isMaximized', payload.toggle);
    }
    case types.SET_FULLSCREEN: {
      return state.set('isFullscreen', payload.toggle);
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
    case types.NAVIGATION_PUSH:
    case types.NAVIGATION_SET:
    case types.NAVIGATION_POP: {
      return state.setIn(['modals', payload.target], null);
    }
    case types.NAVIGATION_MODAL: {
      return state.setIn(['modals', payload.target], payload.modal || null);
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
      return state.set('successState', new Date()).set('successColor', payload.color || 'green');
    }

    default:
      return state;
  }
}
