import { fromJS } from 'immutable';
import * as coreTypes from 'swipes-core-js/redux/constants';
import * as types from '../constants';

const initialState = fromJS({
  sideMenuId: 'Projects',
  onTopSide: 'left',
  left: [
    {
      screenId: 'Projects',
      title: 'Projects'
    }
  ],
  right: [],
  locked: false,
  url: null
});

// Add support for Tester View
const testerState = initialState.set('sideMenuId', 'Tester').set(
  'left',
  fromJS([
    {
      screenId: 'Tester',
      title: 'Tester'
    }
  ])
);

export default function navigationReducer(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.NAVIGATION_URL: {
      let val = payload.url;
      if (payload.url) {
        val = {
          to: payload.url,
          ...payload.options
        };
      }
      return state.set('url', val);
    }
    case types.NAVIGATION_SET: {
      // Enforce lock to go left
      if (state.get('locked')) {
        payload.side = 'left';
      }
      if (payload.side === 'left') {
        state = state.set('sideMenuId', payload.sideMenuId);
      }
      state = state.set('onTopSide', payload.side);
      return state.set(
        payload.side,
        fromJS(payload.screen ? [payload.screen] : [])
      );
    }
    case types.NAVIGATION_SET_ON_TOP: {
      return state.set('onTopSide', payload.side);
    }
    case types.NAVIGATION_SAVE_STATE: {
      return state.updateIn(
        [payload.side, state.get(payload.side).size - 1],
        s => s.setIn(['props', 'savedState'], fromJS(payload.savedState))
      );
    }
    case types.NAVIGATION_TOGGLE_LOCK: {
      if (payload.side === 'left') {
        return state;
      }
      return state.set('locked', !state.get('locked'));
    }
    case types.NAVIGATION_PUSH: {
      const side = state.get('locked') ? 'left' : payload.side;
      state = state.set('onTopSide', side);
      return state.updateIn([side], s => s.push(fromJS(payload.screen)));
    }
    case types.NAVIGATION_POP: {
      if (payload.side === 'right' && state.get('locked')) {
        state = state.set('locked', false);
      }
      return state.updateIn([payload.side], s => {
        if (payload && typeof payload.index === 'number') {
          return s.slice(0, payload.index + 1);
        }
        return s.butLast();
      });
    }
    case 'DEV_OPEN_TESTER': {
      return testerState;
    }
    case coreTypes.RESET_STATE: {
      return initialState;
    }
    default:
      return state;
  }
}
