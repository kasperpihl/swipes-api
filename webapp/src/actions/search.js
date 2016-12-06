import * as types from 'constants';
import { request } from './api';

const search = query => (dispatch) => {
  dispatch({ type: types.SEARCH, query });
  dispatch(request('search', { q: query })).then((res) => {
    if (res && res.ok) {
      dispatch({ type: types.SEARCH_RESULTS, result: res.result });
    } else {
      dispatch({ type: types.SEARCH_ERROR });
    }
  });
};
export default search;
