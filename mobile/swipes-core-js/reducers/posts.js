import * as types from '../constants'
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
    case 'posts.addReaction':
    case 'post_reaction_added': {
      const { post_id, reaction } = payload;
      if (!state.get(post_id)) {
        return state;
      }
      return state.updateIn([post_id, 'reactions'], (reactions) => {
        console.log(reactions.filter(r => r.get('created_by') !== reaction.created_by).insert(0, fromJS(reaction)));
        return reactions.filter(r => r.get('created_by') !== reaction.created_by).insert(0, fromJS(reaction))
      });
    }
    case 'posts.removeReaction':
    case 'post_reaction_removed': {
      const { post_id, user_id } = payload;
      if (!state.get(post_id)) {
        return state;
      }
      return state.updateIn([post_id, 'reactions'], (reactions) => {
        return reactions.filter(r => r.get('created_by') !== payload.user_id);
      });
    }
    default:
      return state
  }
}
