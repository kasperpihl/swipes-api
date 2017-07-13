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
    search: {
      id: 'search',
      title: 'Search',
      description: 'Search goals',
      filter: defaultFilter,
      goals: OrderedSet(),
    }
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
    case types.RESET_STATE: {
      return initialState;
    }
    default:
      return state;
  }
}
