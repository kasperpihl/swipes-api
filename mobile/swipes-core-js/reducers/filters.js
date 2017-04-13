import { fromJS, OrderedSet, List } from 'immutable';
import { REHYDRATE } from 'redux-persist/constants';
import * as types from '../constants';

const defaultFilter = fromJS({});

const initialState = fromJS({
  goals: {
    current: {
      id: 'current',
      title: 'My current',
      description: 'Goals that is which current current step is assigned to you',
      filter: {
        userId: 'me',
        goalType: 'current',
      },
      goals: OrderedSet(),
    },
    starred: {
      id: 'starred',
      title: 'Starred',
      filter: {
        goalType: 'starred',
      },
      goals: OrderedSet(),
    },
    upcoming: {
      id: 'upcoming',
      title: 'Upcoming',
      description: 'Goals that is assigned to you in an upcoming step',
      filter: {
        userId: 'me',
        goalType: 'upcoming',
      },
      goals: OrderedSet(),
    },
    unassigned: {
      id: 'unassigned',
      title: 'Unassigned',
      description: 'Goals that has no steps or is not currently assigned to anyone',
      filter: {
        goalType: 'current',
        userId: 'none',
      },
      goals: OrderedSet(),
    },
    default: {
      id: 'default',
      title: 'Filter',
      description: 'Filter goals to your needs',
      filter: defaultFilter,
      goals: OrderedSet(),
    },
  },
  notifications: {
    received: {
      title: 'Received',
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
      return payload.filters;
    }
    case types.FILTER_UPDATE: {
      return state.setIn([payload.type, payload.id, 'filter'], payload.filter);
    }
    case types.FILTER_CLEAR: {
      return state.setIn([payload.type, payload.id, 'filter'], defaultFilter);
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
