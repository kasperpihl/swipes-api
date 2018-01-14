import { fromJS, Map } from 'immutable';
import * as types from 'constants/ActionTypes';

const initialState = fromJS({
  actionButtons: {},
  sliderIndex: 1,
  collapsed: false,
  sliders: [
    {
      routes: [
        {
          id: 'Notifications',
          title: 'Notifications',
          icon: 'Notification',
        },
      ],
    },
    {
      routes: [
        {
          id: 'Milestones',
          title: 'Plan',
          icon: 'Milestones',
        },
      ],
    },
    {
      routes: [
        {
          id: 'GoalList',
          title: 'Take Action',
          icon: 'Goals',
        },
      ],
    },
    {
      routes: [
        {
          id: 'PostFeed',
          title: 'Discuss',
          icon: 'Messages',
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
    {
      routes: [
        {
          id: 'Search',
          title: 'Search',
          icon: 'Find',
        },
      ],
    },
    {
      routes: [
        {
          id: 'Update',
          title: 'Update',
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
      const { targetIndex, sliderIndex } = payload;
      if(state.getIn(['sliders', sliderIndex, 'routes']).size === 1) {
        return state;
      }
      state = state.set('collapsed', false).set('actionButtons', initialState.get('actionButtons'));
      return state.updateIn(['sliders', sliderIndex, 'routes'], (routes) => {
        if (typeof targetIndex === 'number') {
          return routes.slice(0, targetIndex + 1);
        }
        return routes.butLast();
      });
    }
    case types.RESET_STATE: {
      return initialState;
    }
    default: {
      return state;
    }
  }
}
