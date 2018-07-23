import { fromJS } from 'immutable';

import * as types from '../constants';
const initialState = fromJS({
  'discussion.list': {},
  'discussion.get': {}
});

const updateKeyPath = (state, keyPath, data) => {
  if(!state.getIn(keyPath)) {
    return state;
  }

  return state.mergeIn(keyPath, data);
}

export default function cacheReducer (state = initialState, action) {
  const {
    payload,
    type
  } = action;

  switch (type) {
    case 'discussion.list': {
      payload.discussions.forEach((d) => {
        state = state.setIn([type, payload.type, d.id], fromJS(d));
      })
      return state;
    }
    case 'update': {
      payload.updates.forEach(({ type, data, id }) => {
        if(type === 'discussion'){
          state.get('discussion.list').forEach((v, key) => {
            state = updateKeyPath(state, ['discussion.list', key, id], data);
          });
          state = updateKeyPath(state, ['discussion.get', id], data);
        }
      })
      return state;
    }
    default:
      return state
  }
}