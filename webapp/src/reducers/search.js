import { fromJS, List } from 'immutable';
import * as types from 'constants';

const initialState = fromJS({
  query: null,
  searching: false,
  searchResults: List(),
});

export default function searchReducer(state = initialState, action) {
  switch (action.type) {
    case types.SEARCH: {
      return state.withMutations((ns) => {
        ns.set('searching', true);
        ns.set('searchResults', initialState.get('searchResults'));
        ns.set('query', action.query);
      });
    }
    case types.SEARCH_RESULTS: {
      return state.withMutations((ns) => {
        ns.set('searching', false);
        ns.set('searchResults', fromJS(action.result));
      });
    }
    case types.SEARCH_ERROR: {
      return state.set('searching', false);
    }
    case types.SEARCH_CLEAR:
    default:
      return state;
  }
}
