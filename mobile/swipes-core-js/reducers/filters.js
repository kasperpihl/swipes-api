import { fromJS, OrderedSet, List } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import * as types from '../constants';

const defaultFilter = {};

const initialState = fromJS({
  goals: {
    current: {
      id: 'current',
      title: 'Current',
      filter: {
        userId: 'me',
        goalType: 'current',
      },
      goals: OrderedSet(),
    },
    upcoming: {
      id: 'upcoming',
      title: 'Upcoming',
      filter: {
        userId: 'me',
        goalType: 'upcoming',
      },
      goals: OrderedSet(),
    },
    unstarted: {
      id: 'unstarted',
      title: 'Unstarted',
      filter: {
        goalType: 'unstarted',
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
      filter: n => n.get('notification') || n.get('request'),
      notifications: List(),
    },
    sent: {
      title: 'Sent',
      filter: n => n.get('sender'),
      notifications: List(),
    },
    activity: {
      title: 'Activity',
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
