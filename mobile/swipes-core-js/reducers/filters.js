import { fromJS, OrderedSet, List } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import * as types from '../constants';

const defaultFilter = {};

const initialState = fromJS({
  goals: {
    current: {
      id: 'current',
      title: 'My current',
      filter: {
        userId: 'me',
        goalType: 'current',
      },
      goals: OrderedSet(),
    },
    upcoming: {
      id: 'upcoming',
      title: 'Next',
      filter: {
        userId: 'me',
        goalType: 'upcoming',
      },
      goals: OrderedSet(),
    },
    unassigned: {
      id: 'unassigned',
      title: 'Unassigned',
      filter: {
        goalType: 'current',
        userId: 'none',
      },
      goals: OrderedSet(),
    },
    default: {
      id: 'default',
      title: 'Filter',
      filter: defaultFilter,
      goals: OrderedSet(),
    },
  },
  notifications: {
    notifications: {
      title: 'Notifications',
      filter: n => n.get('notification'),
      notifications: List(),
    },
    sent: {
      title: 'Sent',
      filter: n => n.get('sender'),
      notifications: List(),
    },
    activity: {
      title: 'Team activity',
      filter: n => n.get('activity'),
      notifications: List(),
    },
  },
});

export default function filtersReducer(state = initialState, action) {
  const {
    type,
    payload,
  } = action;

  switch (type) {
    case types.UPDATE_FILTERS: {
      return action.payload.filters;
    }
    case REHYDRATE: {
      if (action.payload && action.payload.filters) {
        // return action.payload.filters.map((f) => f.set('goals', f.get('goals').toOrderedSet()));
      }
      return state;
    }
    default:
      return state;
  }
}
