import { fromJS } from 'immutable';
import * as types from '../constants/ActionTypes';

const initialState = fromJS({
  index: 1,
  slider: [
    {
      id: 'Profile',
      stack: [
        {
          id: 'Profile',
          title: 'Profile',
        },
      ],
    },
    {
      id: 'Dashboard',
      stack: [
        {
          id: 'Dashboard',
          title: 'Dashboard',
        },
      ],
    },
    {
      id: 'GoalList',
      stack: [
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
    case types.NAVIGATION_CHANGE: {
      return state.set('index', payload.index);
    }
    case types.NAVIGATION_STACK_PUSH: {
      return state.updateIn(['slider', payload.sliderIndex, 'stack'], stack => stack.push(payload.scene));
    }
    default:
      return state;
  }
}
