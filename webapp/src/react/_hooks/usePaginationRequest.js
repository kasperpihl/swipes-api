import { useState, useReducer } from 'react';
import request from 'swipes-core-js/utils/request';
import useCallbackRef from 'src/react/_hooks/useCallbackRef';
import useRequest from 'src/react/_hooks/useRequest';

export default function usePaginationRequest(endpoint, params, options) {
  if (
    typeof options !== 'object' ||
    !options.idAttribute ||
    !options.cursorKey ||
    !options.resultPath
  ) {
    throw Error(
      'usePaginationRequest expects an option object with: idAttribute, cursorKey and resultPath'
    );
  }

  const { idAttribute, cursorKey, resultPath } = options;
  const [hasMore, setHasMore] = useState();

  const [items, dispatch] = useReducer((state, action) => {
    const hasAlreadyFilter = item =>
      !action.payload.find(it => item[idAttribute] === it[idAttribute]);
    switch (action.type) {
      case 'seed':
        return action.payload;
      case 'new':
        return action.payload.concat(state.filter(hasAlreadyFilter));
      case 'next':
        return state.filter(hasAlreadyFilter).concat(action.payload);
    }
  }, null);

  const fetchMoreRef = useCallbackRef(async function(type) {
    if (!items || !hasMore) return;
    let newParams = params;
    if (items.length) {
      const index = type === 'new' ? 0 : items.length - 1;
      newParams = {
        ...params,
        cursor: items[index][cursorKey],
        fetch_new: type === 'new'
      };
    }
    const res = await request(endpoint, newParams);
    if (res.ok) {
      dispatch({
        type,
        payload: res[resultPath]
      });
    }
    return res;
  });

  const fetchNew = () => fetchMoreRef.current('new');
  const fetchNext = () => fetchMoreRef.current('next');

  const req = useRequest(endpoint, params, res => {
    console.log('before');
    setHasMore(res.has_more);
    console.log('hi');
    dispatch({ type: 'seed', payload: res[resultPath] });
    console.log('there');
  });

  return {
    ...req,
    items,
    fetchNew,
    fetchNext
  };
}
