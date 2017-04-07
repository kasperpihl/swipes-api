import { fromJS, Map } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  actionButtons: {},
  sliderIndex: 1,
  sliders: [
    {
      routes: [
        {
          id: 'Profile',
          title: 'Profile',
        },
      ],
    },
    {
      routes: [
        {
          id: 'Dashboard',
          title: 'Dashboard',
        },
      ],
    },
    {
      routes: [
        {
          id: 'GoalList',
          title: 'Goal list',
        },
      ],
    },
  ],
});

export default function navigation(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case types.SET_ACTION_BUTTONS: {
      return state.set('actionButtons', Map(payload));
    }
    case types.SLIDER_CHANGE: {
      state = state.set('actionButtons', initialState.get('actionButtons'));
      return state.set('sliderIndex', payload.sliderIndex);
    }
    case types.NAVIGATION_PUSH: {
      state = state.set('actionButtons', initialState.get('actionButtons'));
      return state.updateIn(['sliders', payload.sliderIndex, 'routes'], routes => routes.push(Map(payload.scene)));
    }
    case types.NAVIGATION_POP: {
      state = state.set('actionButtons', initialState.get('actionButtons'));
      return state.updateIn(['sliders', payload.sliderIndex, 'routes'], (routes) => {
        if (typeof payload.targetIndex === 'number') {
          return routes.slice(0, payload.targetIndex + 1);
        } else {
          return routes.butLast();
        }
      });
    }
    default:
      return state;
  }
}
