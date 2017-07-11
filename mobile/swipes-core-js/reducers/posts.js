import * as types from 'constants'
import { fromJS } from 'immutable'
import { reducerInitToMap } from '../classes/utils';
const initialState = fromJS({});

export default function posts (state = initialState, action) {
  const { payload, type } = action;
  switch (action.type) {
    case 'init': {
      return reducerInitToMap(payload, 'posts', state);
    }
    case 'posts.create':
    case 'post_created': {
      if (state.get(payload.post.id)) {
        return state;
      }
      return state.mergeIn([payload.post.id], fromJS(payload.post));
    }
    case 'post_comment_added':
    case 'posts.addComment': {
      const { post_id, comment } = payload;

      if (!state.get(post_id)) {
        return state;
      }

      return state.setIn([post_id, 'comments', comment.id], fromJS(comment));
    }
    default:
      return state
  }
}
