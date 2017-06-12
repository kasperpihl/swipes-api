import { fromJS, Map } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  actionButtons: {},
  sliderIndex: 0,
  collapsed: false,
  sliders: [
    {
      routes: [
        {
          id: 'GoalList',
          title: 'Goals',
          icon: 'Goals',
        },
      ],
    },
    {
      routes: [
        {
          id: 'Milestones',
          title: 'Milestones',
          icon: 'Milestones',
        },
      ],
    },
    {
      routes: [
        {
          id: 'Dashboard',
          title: 'Notifications',
          icon: 'Notification',
        },
      ],
    },
    {
      routes: [
        {
          id: 'Profile',
          title: 'Profile',
          icon: 'Person',
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
    case types.SET_COLLAPSED: {
      return state.set('collapsed', !!payload.collapsed);
    }
    case types.SLIDER_CHANGE: {
      state = state.set('collapsed', false).set('actionButtons', initialState.get('actionButtons'));
      return state.set('sliderIndex', payload.sliderIndex);
    }
    case types.NAVIGATION_PUSH: {
      state = state.set('collapsed', false).set('actionButtons', initialState.get('actionButtons'));
      return state.updateIn(['sliders', payload.sliderIndex, 'routes'], routes => routes.push(Map(payload.scene)));
    }
    case types.NAVIGATION_POP: {
      state = state.set('collapsed', false).set('actionButtons', initialState.get('actionButtons'));
      return state.updateIn(['sliders', payload.sliderIndex, 'routes'], (routes) => {
        if (typeof payload.targetIndex === 'number') {
          return routes.slice(0, payload.targetIndex + 1);
        }
        return routes.butLast();
      });
    }
    default:
      return state;
  }
}
